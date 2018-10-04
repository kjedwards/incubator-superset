import React from 'react';
import Select from 'react-select';

import PropTypes from 'prop-types';
import cx from 'classnames';

import DragDroppable from '../dnd/DragDroppable';
import DragHandle from '../dnd/DragHandle';
import HoverMenu from '../menu/HoverMenu';
import WithPopoverMenu from '../menu/WithPopoverMenu';
import BackgroundStyleDropdown from '../menu/BackgroundStyleDropdown';
import DeleteComponentButton from '../DeleteComponentButton';
import PopoverDropdown from '../menu/PopoverDropdown';
import headerStyleOptions from '../../util/headerStyleOptions';
import { componentShape } from '../../util/propShapes';

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
      isFocused: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleDeleteComponent = this.handleDeleteComponent.bind(this);
    this.handleChangeFocus = this.handleChangeFocus.bind(this);
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

  handleDeleteComponent() {
    const { deleteComponent, id, parentId } = this.props;
    deleteComponent(id, parentId);
  }

  handleChangeFocus(nextFocus) {
    this.setState(() => ({ isFocused: Boolean(nextFocus) }));
  }

  render() {
    const options = [
      { value: 1, label: 'Option1' },
      { value: 2, label: 'Option2' },
      { value: 3, label: 'Option3' },
      { value: 4, label: 'Option4' },
    ];
    const {
      component,
      depth,
      parentComponent,
      index,
      handleComponentDrop,
      editMode,
    } = this.props;

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
                  <DragHandle position="left" />
                  <DeleteComponentButton
                    onDelete={this.handleDeleteComponent}
                  />
                </HoverMenu>
              )}
              <div className={cx('dashboard-component')}>
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
