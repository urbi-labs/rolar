import React from "react";
import Batch1 from "./batch/Batch1";
import Batch2 from "./batch/Batch2";

function validateStep1(payload) {
  const { client, parcel, oliveType } = payload;
  return !(client && parcel && oliveType);
}

function validateStep2(payload) {
  const {
    chuteName,
    chuteWeight,
    deliveryNumber,
    grossWeight,
    receiptNumber,
  } = payload;
  return !(
    chuteName &&
    chuteWeight &&
    deliveryNumber &&
    grossWeight &&
    receiptNumber
  );
}

const Batch = ({
  data,
  step,
  submit,
  onComboChange,
  onInputChange,
  onCheckChange,
  supervisor,
}) => {
  const { step: screen, payload } = data;
  const section = [
    <Batch1
      step={step}
      data={data}
      onComboChange={onComboChange}
      disabled={validateStep1(payload)}
      supervisor={supervisor}
    />,
    <Batch2
      step={step}
      submit={submit}
      data={data}
      onComboChange={onComboChange}
      onInputChange={onInputChange}
      onCheckChange={onCheckChange}
      disabled={validateStep2(payload)}
    />,
  ];
  return section[screen];
};

export default Batch;
