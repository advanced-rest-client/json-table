/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import {JsonTableMixin} from './json-table-mixin.js';
import './json-table-object.js';
import './json-table-primitive-teaser.js';
/**
 * An element that displays array structure.
 *
 * ### Example
 *
 * ```html
 * <json-table-array json="[...]"></json-table-array>
 * ```
 *
 * ### Styling
 *
 * `<json-table>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--json-table-array` | Mixin applied to the element | `{}`
 *
 * @polymer
 * @customElement
 * @appliesMixin JsonTableMixin
 * @memberof UiElements
 */
class JsonTableArray extends JsonTableMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
     :host {
      display: block;

      --table-actions-label-color: rgba(0, 0, 0, 0.74);
      --table-actions-label-font-size: 14px;

      --paper-dropdown-menu: {
        width: 70px;
      };

      --paper-dropdown-menu-input: {
        text-align: right;
      };

      --paper-input-container-underline: {
        border-bottom-color: transparent;
      };

      --paper-input-container-underline-focus: {
        border-bottom-color: transparent;
      };
    }

    paper-dropdown-menu {
      --paper-input-container-input: {
        @apply --arc-font-body1;
        color: var(--table-actions-label-color);
        font-size: var(--table-actions-label-font-size);
      };
    }

    table {
      border-collapse: collapse;
    }

    th {
      white-space: nowrap;
      text-align: left;
      padding: 8px 16px;
      @apply --arc-font-body1;
      font-size: 14px;
      color: var(--json-table-array-header-color, #58595A);
      border-bottom: 3px #e8e9ea solid;
    }

    td {
      min-width: 60px;
      padding: 8px 16px;
      word-break: normal;
      vertical-align: top;
      border-bottom: 1px #E8E9EA solid;
      @apply --arc-font-body1;
      font-size: 14px;
      color: var(--json-table-array-body-color, #121314);
    }

    *[hidden] {
      display: none !important;
    }

    .enum-value {
      display: block;
      padding: 4px 0;
      margin: 4px 0;
    }

    .enum-value::after {
      content: ',';
      color: rgba(0, 0, 0, 0.54);
    }

    .enum-value:last-of-type::after {
      content: ''
    }

    .toggle-view {
      font-size: inherit;
      color: inherit;
      margin-top: 12px;
      display: block;
      white-space: nowrap;
    }

    .toggle-view.active {
      display: inline-block;
      margin-top: 0;
    }

    .table-actions {
      height: 56px;
      @apply --layout-horizontal;
      /*@apply(--layout-end-justified);*/
      @apply --layout-center;
      @apply --arc-font-body1;
      font-size: var(--table-actions-label-font-size);
      color: var(--table-actions-label-color);
    }

    .page-items-count-selector,
    .page-count {
      margin-right: 32px;
      @apply --layout-horizontal;
      @apply --layout-center;
    }
    </style>
    <template is="dom-if" if="[[paginate]]">
      <div class="table-actions">
        <div class="page-items-count-selector">
          <span class="page-items-count-label">Items per page</span>
          <paper-dropdown-menu no-label-float="">
            <paper-listbox slot="dropdown-content" attr-for-selected="data-value" selected="{{itemsPerPage}}">
              <paper-item data-value="10">10</paper-item>
              <paper-item data-value="15">15</paper-item>
              <paper-item data-value="20">20</paper-item>
              <paper-item data-value="25">25</paper-item>
              <paper-item data-value="50">50</paper-item>
              <paper-item data-value="100">100</paper-item>
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div class="page-count">
          [[startItemLabel]]-[[endItemLabel]] of [[maxItemsLabel]]
        </div>
        <div class="page-paginators">
          <paper-icon-button icon="arc:chevron-left" on-tap="previousPage" disabled="[[_isDisabedPrevious(page)]]"></paper-icon-button>
          <paper-icon-button icon="arc:chevron-right" on-tap="nextPage" disabled="[[_isDisabedNext(maxItemsLabel, endItemLabel)]]"></paper-icon-button>
        </div>
      </div>
    </template>
    <table>
      <template is="dom-if" if="[[hasColumns]]">
        <thead>
          <tr>
            <template is="dom-repeat" items="[[columns]]">
              <th>[[item]]</th>
            </template>
          </tr>
        </thead>
      </template>
      <tbody>
        <template is="dom-repeat" items="[[display]]" as="displayItem" initial-count="10">
          <tr>
            <template is="dom-repeat" items="[[columns]]" as="column">
              <td>
                <template is="dom-if" if="[[_isPrimitive(displayItem, column)]]">
                  <json-table-primitive-teaser class="primitive-value">[[_getValue(displayItem, column)]]</json-table-primitive-teaser>
                </template>
                <template is="dom-if" if="[[_isObject(displayItem, column)]]">
                  <json-table-object json="[[_getValue(displayItem, column)]]" paginate="[[paginate]]" page="[[page]]" items-per-page="[[itemsPerPage]]"></json-table-object>
                </template>
                <template is="dom-if" if="[[_isEnum(displayItem, column)]]">
                  <template is="dom-repeat" items="[[_getValue(displayItem, column)]]">
                    <span class="enum-value">[[item]]</span>
                  </template>
                </template>
                <template is="dom-if" if="[[_isArray(displayItem, column)]]" restamp="true">
                  <span class="object-info"><span class="object-label" array="">Array ([[_computeValueSize(displayItem, column)]])</span> <a href="#" class="toggle-view" data-target="array" on-tap="_toggleItem">show array</a></span>
                  <template is="dom-if" if="[[false]]" array="">
                    <json-table-array json="[[_getValue(displayItem, column)]]" paginate="[[paginate]]" page="[[page]]" items-per-page="[[itemsPerPage]]"></json-table-array>
                  </template>
                </template>
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
    <template is="dom-if" if="[[paginate]]">
      <div class="table-actions">
        <div class="page-items-count-selector">
          <span class="page-items-count-label">Items per page</span>
          <paper-dropdown-menu no-label-float="">
            <paper-listbox slot="dropdown-content" attr-for-selected="data-value" selected="{{itemsPerPage}}">
              <paper-item data-value="10">10</paper-item>
              <paper-item data-value="15">15</paper-item>
              <paper-item data-value="20">20</paper-item>
              <paper-item data-value="25">25</paper-item>
              <paper-item data-value="50">50</paper-item>
              <paper-item data-value="100">100</paper-item>
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div class="page-count">
          [[startItemLabel]]-[[endItemLabel]] of [[maxItemsLabel]]
        </div>
        <div class="page-paginators">
          <paper-icon-button icon="arc:chevron-left" on-tap="previousPage" disabled="[[_isDisabedPrevious(page)]]"></paper-icon-button>
          <paper-icon-button icon="arc:chevron-right" on-tap="nextPage" disabled="[[_isDisabedNext(maxItemsLabel, endItemLabel)]]"></paper-icon-button>
        </div>
      </div>
    </template>
`;
  }

  /* global JsonTableMixin */
  static get is() { return 'json-table-array'; }
  static get properties() {
    return {
      // An object to render.
      json: {
        type: Array,
        observer: '_jsonChanged'
      },
      // List of computed column names
      columns: {
        type: Array,
        readOnly: true,
        observer: '_columnsChanged'
      },
      // True if columns list is available.
      hasColumns: {
        type: Boolean,
        value: false,
        readOnly: true
      },
      // data model created from the `json` attribute.
      display: {
        type: Array,
        readOnly: true
      },
      // A label for start index in pagination (1-based)
      startItemLabel: {
        type: Number,
        readOnly: true
      },
      // A label for end index in pagination (1-based)
      endItemLabel: {
        type: Number,
        readOnly: true
      },
      // A label for end index in pagination (1-based)
      maxItemsLabel: {
        type: Number,
        readOnly: true
      }
    };
  }

  static get observers() {
    return [
      '_computeDisplay(json, paginate, page, itemsPerPage)'
    ];
  }

  /**
   * Creates a data model from the `json` property.
   *
   * TODO: This should be a deep data observer to update only the portion of the model that
   * actually has changed.
   */
  _jsonChanged(json) {
    if (!json) {
      this._setDisplay(undefined);
      this._setColumns(undefined);
      return;
    }
    const names = this._computeColumns(json);
    this._setColumns(names);
  }

  _computeDisplay(json, paginate, page, itemsPerPage) {
    if (!json) {
      return;
    }
    const maxInxdex = json.length - 1;
    if (maxInxdex === -1) {
      return;
    }
    if (maxInxdex <= itemsPerPage && this.paginate) {
      return this.set('paginate', false);
    }
    const startIndex = paginate ? (page * itemsPerPage) : 0;
    if (maxInxdex < startIndex) {
      return;
    }
    const endIndex = paginate ? Math.min(startIndex + itemsPerPage - 1, maxInxdex) : maxInxdex;
    const result = [];
    for (let i = startIndex; i <= endIndex; i++) {
      result.push(this.getItemModel(json[i]));
    }
    this._setDisplay(result);
    this._setStartItemLabel(startIndex + 1);
    this._setEndItemLabel(Math.min(endIndex + 1, maxInxdex));
    this._setMaxItemsLabel(maxInxdex);
  }
  /**
   * Computes the list of column names for the table.
   * It will contain all properties keys fond in the array.
   */
  _computeColumns(json) {
    if (this.isEnum(json)) {
      // no column names
      return;
    }
    const columnNames = [];
    json.forEach(function(value) {
      if (this.isObject(value)) {
        const names = Object.keys(value);
        for (let i = 0, len = names.length; i < len; i++) {
          if (columnNames.indexOf(names[i]) === -1) {
            columnNames.push(names[i]);
          }
        }
      }
    }, this);
    return columnNames.length ? columnNames : undefined;
  }
  // Sets the `hasColumns` property when columns array change
  _columnsChanged(columns) {
    if (columns && columns.length) {
      this._setHasColumns(true);
    } else {
      this._setHasColumns(false);
    }
  }
  // Checks if passed `item` is a primitive
  _isPrimitive(item, column) {
    if (!item || !item.value || !column) {
      return false;
    }
    if (!(column in item.value)) {
      return false;
    }
    const obj = item.value[column];
    return this.isPrimitive(obj);
  }

  _isObject(item, column) {
    if (!item || !item.value || !column) {
      return false;
    }
    if (!(column in item.value)) {
      return false;
    }
    const obj = item.value[column];
    return this.isObject(obj);
  }

  _isEnum(item, column) {
    if (!item || !item.value || !column) {
      return false;
    }
    if (!(column in item.value)) {
      return false;
    }
    const obj = item.value[column];
    return this.isArray(obj) && this.isEnum(obj);
  }

  _isArray(item, column) {
    if (!item || !item.value || !column) {
      return false;
    }
    if (!(column in item.value)) {
      return false;
    }
    const obj = item.value[column];
    return this.isArray(obj) && !this.isEnum(obj);
  }

  _getValue(item, column) {
    if (!item || !item.value || !column) {
      return;
    }
    if (!(column in item.value)) {
      return;
    }
    return item.value[column];
  }

  _toggleItem(e) {
    e.preventDefault();
    let cell;
    var currentElement = e.target;
    var targetAnchor =  e.target;
    var templateTarget = currentElement.dataset.target;
    while (true) {
      if (currentElement.nodeName === 'TD') {
        cell = currentElement;
        break;
      }
      currentElement = currentElement.parentElement;
      if (!currentElement) {
        throw new Error('Couldn\'t find table cell in the event path.');
      }
    }
    const tpl = cell.querySelector(`dom-if[${templateTarget}]`);
    const label = cell.querySelector(`.object-label[${templateTarget}]`);
    tpl.if = !tpl.if;
    if (tpl.if) {
      e.target.textContent = 'hide ' + templateTarget;
      label.setAttribute('hidden', true);
      targetAnchor.classList.add('active');
    } else {
      e.target.textContent = 'show ' + templateTarget;
      label.removeAttribute('hidden');
      targetAnchor.classList.remove('active');
    }
  }
  /**
   * When pagination is enabled this will increase page number.
   * This will do nothing if pagination isn't enabled or there's no next page of results to
   * display.
   */
  nextPage() {
    const maxIndex = this.maxItemsLabel;
    const endIndex = this.endItemLabel;
    if (maxIndex <= endIndex) {
      return false;
    }
    this.page++;
  }
  /**
   * When pagination is enabled this will decrease page number.
   * This will do nothing if pagination isn't enabled or there's no previous page of results to
   * display.
   */
  previousPage() {
    if (!this.paginate || this.page === 0) {
      return;
    }
    this.page--;
  }
  /**
   * Computes if the previous page button for the pagination should be disabled.
   *
   * @param {Number} page Current page index
   * @return {Boolean} true if there's previous page of the results
   */
  _isDisabedPrevious(page) {
    return page === 0;
  }

  _isDisabedNext(maxItemsLabel, endItemLabel) {
    if (maxItemsLabel <= endItemLabel) {
      return true;
    }
    return false;
  }

  _computeValueSize(item, column) {
    const value = this._getValue(item, column);
    return value && value.length || 0;
  }
}
window.customElements.define(JsonTableArray.is, JsonTableArray);
