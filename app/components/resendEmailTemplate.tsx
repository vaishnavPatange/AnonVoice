import * as React from 'react';

interface EmailTemplateProps {
  username: string;
  type: string;
  verifyCode: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = (props: EmailTemplateProps) => (
  <div>
    <h1>Welcome, {props.username.toUpperCase()}!</h1>
    {
        props.type === "VERIFY" ? 
            <p className='text-2xl'>To verify your account please use code given below</p>
        : <p className='text-2xl'>To reset your password please use code given below</p>
    }
    <p>VERIFICATION CODE: <b className='text-4xl'>{props.verifyCode}</b></p>
  </div>
);