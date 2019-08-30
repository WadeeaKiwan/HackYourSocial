import React, { Fragment, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { confirmAccount, resendConfirmation } from '../../actions/auth';
import Spinner from '../layout/Spinner';
import './AccountConfirmation';

const AccountConfirmation = ({
  confirmAccount,
  resendConfirmation,
  match,
  auth: {
    loading,
    verification: { msg, verify },
  },
}) => {
  useEffect(() => {
    confirmAccount(match.params.token);
  }, [match.params.token, confirmAccount]);

  const [displayResend, toggleResend] = useState(false);

  const [emailResend, setEmailResend] = useState('');

  const onChange = e => setEmailResend(([e.target.name] = e.target.value));

  const resendEmailSubmit = e => {
    e.preventDefault();
    resendConfirmation(emailResend);
    setEmailResend('');
  };

  return loading || msg === null ? (
    <Spinner />
  ) : verify ? (
    <Fragment>
      <h1 className='large text-primary'>{msg}</h1>
      <Link to='/login' className='btn btn-primary'>
        Sign in
      </Link>
      <p className='my-1'>Your are now an official member of hack your social network </p>
    </Fragment>
  ) : (
    <Fragment>
      <h1 className='large text-danger'>{msg}</h1>
      {!displayResend && (
        <button onClick={() => toggleResend(!displayResend)} className='btn btn-primary'>
          Resend Confirmation Link
        </button>
      )}
      {displayResend && (
        <form className='form my-1' onSubmit={e => resendEmailSubmit(e)}>
          <input
            type='email'
            placeholder='Email Address'
            name='emailResend'
            value={emailResend}
            onChange={e => onChange(e)}
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

AccountConfirmation.propTypes = {
  confirmAccount: PropTypes.func.isRequired,
  resendConfirmation: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { confirmAccount, resendConfirmation },
)(withRouter(AccountConfirmation));
