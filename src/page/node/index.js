import React, { Component } from "react";
import intl from 'react-intl-universal';
import Vote from "../../components/vote";
import "./index.less";

class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className="node">
        <div className="main">
          <div className="tabs">
            <h2>{intl.get('nodelist')}</h2>
            <Vote />
          </div>
        </div>
      </div>
    );
  }
}

export default Node;
