import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login, resendConfirmation } from '../../actions/auth';

const Login = ({ login, resendConfirmation, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [emailData, setEmailData] = useState('');
  const [displayResend, toggleResend] = useState(false);

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  const onEmailChange = e => setEmailData(([e.target.name] = e.target.value));

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Sign Into Your Account
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
      <p className='my-1'>
        Didn't receive a confirmation link?{' '}
        {!displayResend && (
          <a href='#' onClick={() => toggleResend(!displayResend)}>
            Resend
          </a>
        )}
      </p>

      {displayResend && (
        <form
          className='form my-1'
          onSubmit={e => {
            e.preventDefault();
            resendConfirmation(emailData);
            setEmailData('');
          }}
        >
          <input
            type='email'
            placeholder='Email Address'
            name='emailData'
            value={emailData}
            onChange={e => onEmailChange(e)}
            required
          />
          <input type='submit' className='btn btn-primary my-1' value='Resend' />
          <button onClick={() => toggleResend(false)} className='btn btn-light my-1'>
            Cancel
          </button>
        </form>
      )}
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  resendConfirmation: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(
  mapStateToProps,
  { login, resendConfirmation },
)(Login);
