import "./index.css";
import SpanError from "../span-error";
import Grid from "../grid";
import Title from "../title";
import Field from "../field";
import FieldPassword from "../../component/field-password";
import Button from "..//button";

export default function Component({ label, name, type, placeholder, action }) {
  return (
    <Grid>
      <Title> Change email</Title>
      <Field label={label} />
      <FieldPassword />
      <Button />
    </Grid>
  );
}
