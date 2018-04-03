import React, { Component } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';

import { StoreConsumer } from '../store';
import { InlineSelector } from './selector';
import { TimeInput, NumberInput, Checkbox } from './input';
import { DayPicker, IconButton, Button } from './button';

const ScheduleFiltersWrapper = styled.div`
  grid-area: schedule-filters;
`;

const FilterWrapper = styled.div`
  display: flex;
  font-size: 12px;
  align-items: center;

  > * + * {
    margin-left: 8px;
  }
`;

const FilterList = styled.div`
  padding: 16px;
  background: #fff;
  box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.2);
  

  ${FilterWrapper} + ${FilterWrapper} {
    margin-top: 16px;
  }
`;

const FilterOptions = styled.div`
  display: flex;
  margin-bottom: 8px;

  .spacer {
    flex: 1;
  }

  button + button {
    margin-left: 8px;
  }
`;

const filterComponents = {
  class_time: (id, { operator, time, days }, onUpdate, onDelete) => (
    <FilterWrapper key={id}>
      <IconButton leftIcon="trash" danger onClick={onDelete} />
      <span>I want to</span>
      <TimeOperatorSelector
        selectedOption={operator}
        onSelectOption={operator => onUpdate({ operator })}
      />
      <TimeInput
        placeholder="10:00 AM"
        defaultValue={time}
        onChange={event => onUpdate({ time: event.target.value })}
      />
      <span>on</span>
      <DayPicker selectedDays={days} onChange={days => onUpdate({ days })} />
    </FilterWrapper>
  ),
  class_load: (id, { operator, amount, days }, onUpdate, onDelete) => (
    <FilterWrapper key={id}>
      <IconButton leftIcon="trash" danger onClick={onDelete} />
      <span>I want</span>
      <AmountOperatorSelector
        selectedOption={operator}
        onSelectOption={operator => onUpdate({ operator })}
      />
      <NumberInput
        placeholder="3"
        defaultValue={amount || 0}
        onChange={event => onUpdate({ amount: parseInt(event.target.value) })}
      />
      <span>classes on</span>
      <DayPicker selectedDays={days} onChange={days => onUpdate({ days })} />
    </FilterWrapper>
  ),
  break_time: (id, { from, until, days }, onUpdate, onDelete) => (
    <FilterWrapper key={id}>
      <IconButton leftIcon="trash" danger onClick={onDelete} />
      <span>I want a break from</span>
      <TimeInput
        placeholder="10:00 AM"
        defaultValue={from}
        onChange={event => onUpdate({ from: event.target.value })}
      />
      <span>until</span>
      <TimeInput
        placeholder="12:00 PM"
        defaultValue={until}
        onChange={event => onUpdate({ until: event.target.value })}
      />
      <span>on</span>
      <DayPicker selectedDays={days} onChange={days => onUpdate({ days })} />
    </FilterWrapper>
  )
};

function FilterTypeSelector(props) {
  return (
    <InlineSelector
      {...props}
      options={[
        { value: 'filter_type', name: 'Filter Type' },
        { value: 'class_time', name: 'Class Time' },
        { value: 'break_time', name: 'Break Time' },
        { value: 'class_load', name: 'Class Load' }
      ]}
    />
  );
}

function TimeOperatorSelector(props) {
  return (
    <InlineSelector
      {...props}
      options={[
        { value: 'start_before', name: 'start before' },
        { value: 'start_at', name: 'start at' },
        { value: 'start_after', name: 'start after' },
        { value: 'finish_before', name: 'finish before' },
        { value: 'finish_at', name: 'finish at' },
        { value: 'finish_after', name: 'finish after' }
      ]}
    />
  );
}

function AmountOperatorSelector(props) {
  return (
    <InlineSelector
      {...props}
      options={[
        { value: 'less_than', name: 'less than' },
        { value: 'at_most', name: 'at most' },
        { value: 'exactly', name: 'exactly' },
        { value: 'at least', name: 'at least' },
        { value: 'more than', name: 'more than' }
      ]}
    />
  );
}

function ScheduleFilters({
  filters,
  filtersChanged,
  onCreateFilter,
  onUpdateFilter,
  onDeleteFilter,
  onApplyFilters
}) {
  return (
    <ScheduleFiltersWrapper>
      <FilterOptions>
        <IconButton
          leftIcon="plus"
          large
          raised
          onClick={() => onCreateFilter('class_time')}
        >
          Class Time Filter
        </IconButton>
        <IconButton
          leftIcon="plus"
          large
          raised
          onClick={() => onCreateFilter('class_load')}
        >
          Class Load Filter
        </IconButton>
        <IconButton
          leftIcon="plus"
          large
          raised
          onClick={() => onCreateFilter('break_time')}
        >
          Break Time Filter
        </IconButton>
        <div className="spacer" />
        <IconButton
          rightIcon="sliders-h"
          large
          raised
          primary
          disabled={!filtersChanged}
          onClick={onApplyFilters}
        >
          Apply Filters
        </IconButton>
      </FilterOptions>
      <FilterList>
        {filters.map(({ id, type, ...filter }) =>
          filterComponents[type](
            id,
            filter,
            update => onUpdateFilter(id, update),
            () => onDeleteFilter(id)
          )
        )}
      </FilterList>
    </ScheduleFiltersWrapper>
  );
}

export function ScheduleFiltersContainer() {
  return (
    <StoreConsumer>
      {(state, actions) => (
        <ScheduleFilters
          filters={state.scheduleFilters}
          filtersChanged={state.filtersChanged}
          onCreateFilter={type => actions.createFilter(type)}
          onUpdateFilter={(id, update) => actions.updateFilter(id, update)}
          onDeleteFilter={id => actions.deleteFilter(id)}
          onApplyFilters={() => actions.applyFilters()}
        />
      )}
    </StoreConsumer>
  );
}
