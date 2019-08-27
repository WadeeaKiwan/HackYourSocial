import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { confirmAccount } from '../../actions/auth';

const AccountConfirmed = ({ confirmAccount, match }) => {
  useEffect(() => {
    confirmAccount(match.params.token);
  }, [confirmAccount, match.params.token]);

  return (
    <Fragment>
      <h1 className='large text-primary'>Your account has been confirmed!</h1>
      <p className='lead'>
        You can now{' '}
        <Link to='/login' className='btn btn-primary'>
          Sign In
        </Link>
      </p>
    </Fragment>
  );
};

AccountConfirmed.propTypes = {
  confirmAccount: PropTypes.func.isRequired,
};

export default connect(
  null,
  { confirmAccount },
)(withRouter(AccountConfirmed));
