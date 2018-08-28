import React from 'react';

import PropTypes from 'prop-types';

const propTypes = {
  openFilter: PropTypes.bool,
};

class Filter extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      openFilter: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    if (this.state.openFilter) {
      this.setState({ openFilter: false });
    } else {
      this.setState({ openFilter: true });
    }
  }
  render() {
    return (
      <div className="filter-container">
        <div className="filter-title">
          <button onClick={this.handleClick}>
            Filters
            {this.state.openFilter ? (
              <i className="fa fa-angle-up" />
            ) : (
              <i className="fa fa-angle-down" />
            )}
          </button>
        </div>
        {this.state.openFilter ? (
          <div className="filter-list">
            <div className="filter-item">
              <div>Filter 1</div>
              <input />
            </div>
            <div className="filter-item">
              <div>Filter 2</div>
              <input />
            </div>
            <div className="filter-item">
              <div>Filter 3</div>
              <input />
            </div>
            <div className="filter-item">
              <div>Filter 4</div>
              <input />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Filter;
