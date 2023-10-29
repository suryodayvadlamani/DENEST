import React from "react";

import FormInput from "@components/Form/FormInput";
import { Input } from "@UI/input";

function AddressForm({ form }) {
  return (
    <>
      <FormInput
        className="mb-3"
        name="addressLine1"
        form={form}
        id="add1"
        type="text"
        label="Address Lane 1"
      />
      <FormInput
        className="mb-3"
        name="addressLine2"
        form={form}
        id="add2"
        type="text"
        label="Address Lane 2"
      />

      <div className="flex gap-1 mt-1">
        <FormInput
          className="mb-3"
          name="pincode"
          form={form}
          id="pincode"
          type="numeric"
          label="Pincode"
          pattern="[1-9]{1}[0-9]{2}[0-9]{3}"
          maxLength="6"
        />
        <FormInput
          className="mb-3"
          name="district"
          form={form}
          id="district"
          type="text"
          label="District"
        />
      </div>
      <div className="flex gap-1 mt-1">
        <FormInput
          className="mb-3"
          name="state"
          form={form}
          id="state"
          type="text"
          label="State"
        />
        <FormInput
          className="mb-3"
          name="country"
          form={form}
          id="country"
          type="text"
          label="Country"
        />
      </div>
    </>
  );
}

export default AddressForm;
