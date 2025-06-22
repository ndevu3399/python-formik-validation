// src/Form.js
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function Form() {
  const [customers, setCustomers] = useState([]);
  const [refreshPage, setRefreshPage] = useState(false);

  useEffect(() => {
    fetch("/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data));
  }, [refreshPage]);

  const formSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Must enter email"),
    name: yup.string().required("Must enter a name").max(15),
    age: yup
      .number()
      .positive()
      .integer()
      .required("Must enter age")
      .typeError("Please enter an Integer")
      .max(125),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", age: "" },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }).then((res) => {
        if (res.status === 200) {
          setRefreshPage(!refreshPage);
        }
      });
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <label>Email</label><br />
        <input name="email" value={formik.values.email} onChange={formik.handleChange} />
        <p style={{ color: "red" }}>{formik.errors.email}</p>

        <label>Name</label><br />
        <input name="name" value={formik.values.name} onChange={formik.handleChange} />
        <p style={{ color: "red" }}>{formik.errors.name}</p>

        <label>Age</label><br />
        <input name="age" value={formik.values.age} onChange={formik.handleChange} />
        <p style={{ color: "red" }}>{formik.errors.age}</p>

        <button type="submit">Submit</button>
      </form>

      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Age</th></tr>
        </thead>
        <tbody>
          {customers.map((c, i) => (
            <tr key={i}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Form;
