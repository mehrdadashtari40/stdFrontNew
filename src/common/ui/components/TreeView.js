import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
// --- CRITICAL CHANGE 1: Import from your polyfill ---
import { findDOMNode } from '../../../findDOMNode-polyfill'; // Ensure this path is correct
import { HtmlRender } from '../../utils';
import $ from 'jquery';

// --- TreeViewItem Component ---
export class TreeViewItem extends React.Component {
  constructor(props) {
    super(props);
    // Use a ref to store the DOM node reference obtained via findDOMNode
    this.treeViewItemRef = React.createRef(); // Or use a callback ref if preferred
  }

  _handleExpand = (e) => {
    e.stopPropagation();
    let item = this.props.item;
    if (item.children && item.children.length) {
      // Toggle the expanded state on the item object itself (as per original logic)
      // Consider using state management if this state needs to be shared
      item.expanded = !item.expanded;
      this.forceUpdate(); // Force update as item.expanded is mutated
    }
  };

  // --- CRITICAL CHANGE 2: Use findDOMNode from polyfill in lifecycle methods ---
  _handleIcon = () => {
    let item = this.props.item;
    // Check if the item has children
    if (item.children && item.children.length) {
      // --- Use findDOMNode from your polyfill ---
      // Pass the component instance (this) to findDOMNode
      try {
        const domNode = findDOMNode(this); // Use the polyfilled findDOMNode
        if (domNode) {
          // Find the specific icon element within the DOM node
          // Adjust the selector if your HTML structure is different
          const $icon = $(domNode).find('> p > span > i'); // Example selector
          if ($icon.length > 0) {
            // Toggle classes based on the item's expanded state
            $icon
              .toggleClass('fa-plus-circle', !item.expanded)
              .toggleClass('fa-minus-circle', !!item.expanded);
          }
        }
      } catch (error) {
        console.error("Error accessing DOM node in TreeViewItem _handleIcon:", error);
        // Gracefully handle if findDOMNode fails or returns null/undefined
      }
    }
  };

  componentDidMount() {
    this._handleIcon();
  }

  componentDidUpdate() {
    this._handleIcon(); // Re-run icon handling after updates
  }

  render() {
    let item = this.props.item;

    // Recursively render children TreeViews if they exist and the item is expanded
    let children = item.children ? (
      <TreeView
        className={classnames({
          'smart-treeview-group': true,
          hidden: !item.expanded,
        })}
        items={item.children}
        role="group"
      />
    ) : null;

    return (
      <li
        // Assign the ref for potential direct access if needed elsewhere,
        // though findDOMNode is used here as per your setup.
        ref={this.treeViewItemRef}
        className={classnames({
          parent_li: item.children && item.children.length,
        })}
        onClick={this._handleExpand}
      >
        {/* Render the HTML content string */}
        <HtmlRender html={item.content} />
        {children}
      </li>
    );
  }
}

// --- TreeView Component ---
export default class TreeView extends React.Component {
  render() {
    let items = this.props.items;
    // Guard against undefined/null items
    if (!items) {
      return null; // Or render a placeholder if preferred
    }

    return (
      <ul role={this.props.role} className={this.props.className}>
        {items.map((item) => {
          // --- CRITICAL CHANGE 3: Improve key generation ---
          // Prioritize a stable unique ID from the item data.
          // Fallback to _.uniqueId only if absolutely necessary, though not ideal.
          // Ensure your data items ideally have a unique 'id' or similar property.
          const key = item && item.id ? `treeview-item-${item.id}` : _.uniqueId('treeview-item-');

          return <TreeViewItem key={key} item={item} />;
        })}
      </ul>
    );
  }
}