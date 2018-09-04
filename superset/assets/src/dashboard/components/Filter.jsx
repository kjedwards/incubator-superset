import React from 'react';

import Select from 'react-select';

const propTypes = {};

class Filter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openFilter: false,
      value: [],
    };

    this.handleClick = this.handleClick.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }
  onInputChange(value) {
    this.setState({ value });
  }
  handleClick() {
    if (this.state.openFilter) {
      this.setState({ openFilter: false });
    } else {
      this.setState({ openFilter: true });
    }
  }
  render() {
    const options = [
      { value: 1, label: 'Option1' },
      { value: 2, label: 'Option2' },
      { value: 3, label: 'Option3' },
      { value: 4, label: 'Option4' },
    ];
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
              <Select
                multi
                defaultValue={options[0]}
                isClearable
                isSearchable
                value={this.state.value}
                onChange={this.onInputChange}
                name="test1"
                options={options}
              />
            </div>
            <div className="filter-item">
              <div>Filter 2</div>
              <Select
                multi
                defaultValue={options[0]}
                isClearable
                isSearchable
                value={this.state.value}
                onChange={this.onInputChange}
                name="test1"
                options={options}
              />
            </div>
            <div className="filter-item">
              <div>Filter 3</div>
              <Select
                multi
                defaultValue={options[0]}
                isClearable
                isSearchable
                value={this.state.value}
                onChange={this.onInputChange}
                name="test1"
                options={options}
              />
            </div>
            <div className="filter-item">
              <div>Filter 4</div>
              <Select
                multi
                defaultValue={options[0]}
                isClearable
                isSearchable
                value={this.state.value}
                onChange={this.onInputChange}
                name="test1"
                options={options}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

Filter.propTypes = propTypes;
export default Filter;
