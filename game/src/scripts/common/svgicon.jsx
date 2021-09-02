import React from 'react';
import PropTypes from 'prop-types';

export const SvgIcon = (props) => {
  const { icon } = props;
  return <svg
    className={`custom-icon custom-icon-${icon.id}`}
    {...props}
  >
    <use xlinkHref={`#${icon.id}`} />
  </svg>;
};

SvgIcon.propTypes = {
  icon: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};
