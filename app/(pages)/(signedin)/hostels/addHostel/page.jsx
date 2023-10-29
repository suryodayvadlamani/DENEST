"use client";
import React from "react";
import AddHostel from "@components/Hostel/AddHostel";
import FormDialog from "@components/Form/FormDialog";

function page() {
  return (
    <FormDialog title="Add Hostel" triggerTitle="+Add Hostel">
      <AddHostel />
    </FormDialog>
  );
}

export default page;
