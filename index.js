import React, { Component, PropTypes as T } from 'react';

export default class Pusher extends Component {
  static propTypes = {
    channel: T.string.isRequired,
    onUpdate: T.func.isRequired,
    event: T.string.isRequired,
  };

  static pusherClient = null;
  static channels = {};

  constructor(props) {
    if (!Pusher.pusherClient) {
      throw new Error('you must set a pusherClient by calling setPusherClient');
    }

    super(props);
    this.bindPusherEvent(props.channel, props.event);
  }

  componentWillMount() {
    console.log('componentWillMount')
  }

  componentDidMount() {
    console.log('componentDidMount')
  }

  componentWillUpdate () {
    console.log('componentWillUpdate')
  }

  componentDidUpdate () {
    console.log('componentDidUpdate')
  }

  componentWillReceiveProps({ channel: newChannel, event: newEvent }) {
    const { channel, event } = this.props;
    console.log('componentWillReceiveProps')
    console.log('newChannel', newChannel)
    console.log('newEvent', newEvent)
    console.log('channel', channel)
    console.log('event', event)
    if (channel === newChannel && event === newEvent) {
      return;
    }

    this.bindPusherEvent(newChannel, newEvent);
    this.unbindPusherEvent(channel, event);
  }

  componentDidUpdate({ channel: oldChannel, event: oldEvent }) {
    const { channel, event } = this.props;

    console.log('componentDidUpdate')
    console.log('oldChannel', oldChannel)
    console.log('oldEvent', oldEvent)
    console.log('channel', channel)
    console.log('event', event)

    if (channel === oldChannel && event === oldEvent) {
      return;
    }

    this.bindPusherEvent(channel, event);
    this.unbindPusherEvent(oldChannel, oldEvent);
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    this.unbindPusherEvent(this.props.channel, this.props.event);
  }

  unbindPusherEvent(channel, event) {
    this._channel.unbind(event, this.props.onUpdate);
    Pusher.channels[channel]--;

    if (Pusher.channels[channel] <= 0) {
      delete Pusher.channels[channel];
      Pusher.pusherClient.unsubscribe(channel);
    }
  }

  bindPusherEvent(channel, event) {
    this._channel =
      Pusher.pusherClient.channels.find(channel)
      || Pusher.pusherClient.subscribe(channel);
    this._channel.bind(event, this.props.onUpdate);

    if (Pusher.channels[channel] === undefined) Pusher.channels[channel] = 0;
    Pusher.channels[channel]++;
  }

  _channel = null;

  render() {
    return <noscript />;
  }
}

export const setPusherClient = (pusherClient) => { Pusher.pusherClient = pusherClient; };
