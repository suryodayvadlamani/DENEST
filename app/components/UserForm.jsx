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
        required
      />
      <FormInput
        className="mb-3"
        name="contact"
        form={form}
        id="contactnum"
        type="tel"
        label="Contact Number"
        maxLength="10"
        required
      />
      <FormInput
        className="mb-3"
        name="email"
        form={form}
        id="email"
        type="email"
        label="Email Address"
        required
      />
    </>
  );
}

export default UserForm;
