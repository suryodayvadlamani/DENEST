import FormInput from "@components/Form/FormInput";

function UserForm({ form }) {
  return (
    <>
      <FormInput
        className="mb-3"
        name="name"
        form={form}
        id="manager"
        type="text"
        label="Name"
      />
      <FormInput
        className="mb-3"
        name="contact"
        form={form}
        id="contactnum"
        type="tel"
        label="Contact Number"
        maxLength="10"
      />
      <FormInput
        className="mb-3"
        name="email"
        form={form}
        id="email"
        type="email"
        label="Email Address"
      />
    </>
  );
}

export default UserForm;
