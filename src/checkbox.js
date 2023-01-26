import React from "react";

const Checkbox = ({id, label, checked, onChange, ...props }) => {

  return (
    <div className="checkbox-wrapper"
    aria-hidden="true"
    viewBox="0 0 15 11"
    fill="none">
      
        <input type="checkbox" checked={checked}
        onChange={() => onChange(id)} 
        {...props}
        />
      <label htmlFor={id}> {label}</label>
    </div>
  );
};
export default Checkbox;
