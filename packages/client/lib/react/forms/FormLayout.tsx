import React from 'react';
import './forms.css';

export const FormLayout = (props: { children: React.ReactNode }) => {
  return <div className="form-layout">
    {props.children}
  </div>
}