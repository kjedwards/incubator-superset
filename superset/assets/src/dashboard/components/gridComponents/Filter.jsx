import React from 'react';
import Select from 'react-select';

import PropTypes from 'prop-types';
import cx from 'classnames';

import DragDroppable from '../dnd/DragDroppable';
import DragHandle from '../dnd/DragHandle';
import HoverMenu from '../menu/HoverMenu';
import WithPopoverMenu from '../menu/WithPopoverMenu';
import IconButton from '../IconButton';
import DeleteComponentButton from '../DeleteComponentButton';
import ModalTrigger from '../../../components/ModalTrigger';
import { componentShape } from '../../util/propShapes';
import DateFilterControl from '../../../explore/components/controls/DateFilterControl';
import { t } from '../../../locales';

// maps control names to their key in extra_filters
const timeFilterMap = {
  time_range: '__time_range',
  granularity_sqla: '__time_col',
  time_grain_sqla: '__time_grain',
  druid_time_origin: '__time_origin',
  granularity: '__granularity',
};

const propTypes = {
  id: PropTypes.string.isRequired,
  parentId: PropTypes.string.isRequired,
  component: componentShape.isRequired,
  depth: PropTypes.number.isRequired,
  parentComponent: componentShape.isRequired,
  index: PropTypes.number.isRequired,
  editMode: PropTypes.bool.isRequired,

  // redux
  handleComponentDrop: PropTypes.func.isRequired,
  deleteComponent: PropTypes.func.isRequired,
  updateComponents: PropTypes.func.isRequired,
};

class Filter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openFilter: false,
      value: [],
      timeColumnValue: '',
      timeGrainValue: '',
      dateFilerValue: false,
      instantFilteringValue: false,
      showSQLGranularityDropdownValue: false,
      showSQLTimeColumnValue: false,
      showDruidGranularityDropdownValue: false,
      showDruidTimeOriginValue: false,
      isFocused: false,
      selectedTimeValues: {},
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleDeleteComponent = this.handleDeleteComponent.bind(this);
    this.handleChangeFocus = this.handleChangeFocus.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onTimeColChange = this.onTimeColChange.bind(this);
    this.onTimeGrainChange = this.onTimeGrainChange.bind(this);
  }

  onInputChange(value) {
    this.setState({ value });
  }

  onTimeColChange(value) {
    const selectedTimeValues = Object.assign({}, this.state.selectedTimeValues);
    selectedTimeValues[timeFilterMap.granularity_sqla] = value;
    this.setState({ selectedTimeValues });
  }

  onTimeGrainChange(value) {
    const selectedTimeValues = Object.assign({}, this.state.selectedTimeValues);
    selectedTimeValues[timeFilterMap.time_grain_sqla] = value;
    this.setState({ selectedTimeValues });
  }

  handleClick() {
    if (this.state.openFilter) {
      this.setState({ openFilter: false });
    } else {
      this.setState({ openFilter: true });
    }
  }

  handleDeleteComponent() {
    const { deleteComponent, id, parentId } = this.props;
    deleteComponent(id, parentId);
  }

  handleChangeFocus(nextFocus) {
    this.setState(() => ({ isFocused: Boolean(nextFocus) }));
  }

  changeFilter(filter, options) {
    const fltr = timeFilterMap[filter] || filter;
    let vals = null;
    if (options !== null) {
      if (Array.isArray(options)) {
        vals = options.map(opt => opt.value);
      } else if (options.value) {
        vals = options.value;
      } else {
        vals = options;
      }
    }
    const selectedTimeValues = Object.assign({}, this.state.selectedTimeValues);
    selectedTimeValues[fltr] = vals;
    this.setState({ selectedTimeValues, hasChanged: true });
    if (this.state.instantFilteringValue) {
      this.changeFilter.bind(fltr, vals, false, true);
    }
  }

  render() {
    const options = [
      { value: 1, label: 'Option1' },
      { value: 2, label: 'Option2' },
      { value: 3, label: 'Option3' },
      { value: 4, label: 'Option4' },
    ];
    const timeColumnOptions = [
      { value: 1, label: 'Column1' },
      { value: 2, label: 'Column2' },
      { value: 3, label: 'Column3' },
      { value: 4, label: 'Column4' },
    ];
    const timeGrainOptions = [
      { value: 1, label: 'Time Column' },
      { value: 2, label: 'Second' },
      { value: 3, label: 'Minute' },
      { value: 4, label: 'Hour' },
      { value: 5, label: 'Day' },
      { value: 6, label: 'Week' },
      { value: 7, label: 'Month' },
      { value: 8, label: 'Quarter' },
      { value: 9, label: 'Year' },
    ];
    const {
      component,
      depth,
      parentComponent,
      index,
      handleComponentDrop,
      editMode,
    } = this.props;

    const timeRange = timeFilterMap.time_range;
    const timeCol = timeFilterMap.granularity_sqla;
    const timeGrain = timeFilterMap.time_grain_sqla;

    return (
      <DragDroppable
        component={component}
        parentComponent={parentComponent}
        orientation="row"
        index={index}
        depth={depth}
        onDrop={handleComponentDrop}
        editMode={editMode}
      >
        {({ dropIndicatorProps, dragSourceRef }) => (
          <div ref={dragSourceRef}>
            {editMode &&
            depth <= 2 && ( // drag handle looks bad when nested
                <HoverMenu position="left">
                  <DragHandle position="left" />
                </HoverMenu>
              )}

            <WithPopoverMenu
              isFocused={this.state.isFocused}
              onChangeFocus={this.handleChangeFocus}
              disableClick
              editMode={editMode}
            >
              {editMode && (
                <HoverMenu innerRef={dragSourceRef} position="top">
                  <DragHandle position="top" />
                  <DeleteComponentButton
                    onDelete={this.handleDeleteComponent}
                  />
                  <ModalTrigger
                    modalTitle={<div>{t('Filter Options')}</div>}
                    modalBody={
                      <div className="config-modal">
                        <div className="select-container">
                          <div className="select-item">
                            <div className="filter-title">Time Column</div>
                            <Select
                              defaultValue={timeColumnOptions[0]}
                              isSearchable
                              value={this.state.selectedTimeValues[timeCol]}
                              onChange={this.onTimeColChange}
                              name="timeColumn"
                              options={timeColumnOptions}
                            />
                          </div>
                          <div className="select-item">
                            <div className="filter-title">Time Grain</div>
                            <Select
                              defaultValue={timeGrainOptions[0]}
                              isSearchable
                              value={this.state.selectedTimeValues[timeGrain]}
                              onChange={this.onTimeGrainChange}
                              name="timeGrain"
                              options={timeGrainOptions}
                            />
                          </div>
                        </div>
                        <div className="date-filter-control-container">
                          <DateFilterControl
                            name={timeRange}
                            label={t('Time Range')}
                            description={t('Select start and end date')}
                            onChange={this.changeFilter.bind(this, timeRange)}
                            value={this.state.selectedTimeValues[timeRange]}
                          />
                        </div>
                        <div className="checkbox-container">
                          <div className="checkbox-item">
                            <input
                              type="checkbox"
                              name="Date Filter"
                              value={this.state.dateFilerValue}
                            />
                            <div className="filter-title">Date Filter</div>
                          </div>
                          <div className="checkbox-item">
                            <input
                              type="checkbox"
                              name="Instant Filtering"
                              value={this.state.instantFilteringValue}
                            />
                            <div className="filter-title">
                              Instant Filtering
                            </div>
                          </div>
                          <div className="checkbox-item">
                            <input
                              type="checkbox"
                              name="Show SQL Granularity Dropdown"
                              value={this.state.showSQLGranularityDropdownValue}
                            />
                            <div className="filter-title">
                              Show SQL Granularity Dropdown
                            </div>
                          </div>
                          <div className="checkbox-item">
                            <input
                              type="checkbox"
                              name="Show SQL Time Column"
                              value={this.state.showSQLTimeColumnValue}
                            />
                            <div className="filter-title">
                              Show SQL Time Column
                            </div>
                          </div>
                          <div className="checkbox-item">
                            <input
                              type="checkbox"
                              name="Show Druid Granularity Dropdown"
                              value={
                                this.state.showDruidGranularityDropdownValue
                              }
                            />
                            <div className="filter-title">
                              Show Druid Granularity Dropdown
                            </div>
                          </div>
                          <div className="checkbox-item">
                            <input
                              type="checkbox"
                              name="Show Druid Time Origin"
                              value={this.state.showDruidTimeOriginValue}
                            />
                            <div className="filter-title">
                              Show Druid Time Origin
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    triggerNode={
                      <IconButton
                        onClick={this.handleChangeFocus}
                        className="fa fa-cog"
                      />
                    }
                  />
                </HoverMenu>
              )}
              <div className={cx('dashboard-component')}>
                <div className="filter-container">
                  <div className="filter-title">
                    <button onClick={this.handleClick}>
                      {t('Filters')}
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
              </div>
            </WithPopoverMenu>

            {dropIndicatorProps && <div {...dropIndicatorProps} />}
          </div>
        )}
      </DragDroppable>
    );
  }
}

Filter.propTypes = propTypes;
export default Filter;
