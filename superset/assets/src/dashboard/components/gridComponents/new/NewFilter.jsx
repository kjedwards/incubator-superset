import React from 'react';

import { FILTER_TYPE } from '../../../util/componentTypes';
import { NEW_FILTER_ID } from '../../../util/constants';
import DraggableNewComponent from './DraggableNewComponent';

export default function DraggableNewFilter() {
  return (
    <DraggableNewComponent
      id={NEW_FILTER_ID}
      type={FILTER_TYPE}
      label="Filter"
      className="fa fa-filter"
    />
  );
}
