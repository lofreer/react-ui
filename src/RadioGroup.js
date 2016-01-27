"use strict";

import { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { deepEqual, toTextValue } from './utils/objects';
import { fetchEnhance, FETCH_SUCCESS } from './higherOrders/Fetch';
import { register } from './higherOrders/FormItem';
import { getLang } from './lang';
import Radio from './Radio';

class RadioGroup extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: this.props.value,
      data: this.formatData(this.props.data)
    };
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setValue(nextProps.value);
    }
    if (!deepEqual(nextProps.data, this.props.data)) {
      this.setState({ data: this.formatData(nextProps.data) });
    }
  }

  formatData (data) {
    return toTextValue(data, this.props.textTpl, this.props.valueTpl);
  }

  setValue (value) {
    this.setState({ value });
  }

  getValue () {
    return this.state.value;
  }

  handleChange (value) {
    if (this.props.readOnly) {
      return;
    }

    this.setState({ value });
    let change = this.props.onChange;
    if (change) {
      setTimeout(function () {
        change(value);
      }, 0);
    }
  }

  render () {
    let { className, fetchStatus, inline, readOnly } = this.props;

    // if get remote data pending or failure, render message
    if (fetchStatus !== FETCH_SUCCESS) {
      return <span className={`fetch-${fetchStatus}`}>{getLang('fetch.status')[fetchStatus]}</span>;
    }

    className = classnames(
      className,
      'rct-radio-group',
      { 'rct-inline': inline }
    );
    let items = this.state.data.map(function (item, i) {
      return (
        <Radio key={i}
          onClick={this.handleChange}
          readOnly={readOnly}
          checked={this.state.value === item.$value}
          text={item.$text}
          value={item.$value}
        />
      );
    }, this);

    return (
      <div style={this.props.style} className={className}>{items}</div>
    );
  }
}

RadioGroup.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  inline: PropTypes.bool,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  style: PropTypes.object,
  textTpl: PropTypes.string,
  value: PropTypes.any,
  valueTpl: PropTypes.string
};

RadioGroup.defaultProps = {
  textTpl: '{text}',
  valueTpl: '{id}'
};

RadioGroup = fetchEnhance(RadioGroup);

module.exports = register(RadioGroup, 'radio-group');