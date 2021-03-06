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
import { LitElement, html, css } from 'lit-element';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import { chevronLeft, chevronRight } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import { JsonTableMixin } from './JsonTableMixin.js';
import '../json-table-primitive-teaser.js';

/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */

/** @typedef {import('./JsonTableMixin').PropertyModelItem} PropertyModelItem */
/** @typedef {import('./JsonTableMixin').ModelItem} ModelItem */
/** @typedef {import('lit-element').TemplateResult} TemplateResult */

/**
 * An element that displays array structure.
 *
 * ### Example
 *
 * ```html
 * <json-table-array json="[...]"></json-table-array>
 * ```
 */
export class JsonTableArrayElement extends JsonTableMixin(LitElement) {
  get styles() {
    return css`:host {
     display: block;
     font-size: var(--arc-font-body1-font-size);
     font-weight: var(--arc-font-body1-font-weight);
     line-height: var(--arc-font-body1-line-height);
   }

   anypoint-dropdown-menu {
     width: 70px;
   }

   table {
     border-collapse: collapse;
   }

   th {
     white-space: nowrap;
     text-align: left;
     padding: 8px 16px;
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
     display: flex;
     flex-direction: row;
     align-items: center;
     font-size: var(--table-actions-label-font-size);
     color: var(--table-actions-label-color);
   }

   .page-items-count-selector,
   .page-count {
     margin-right: 32px;
     height: 56px;
     display: flex;
     flex-direction: row;
     align-items: center;
   }

   .icon {
     width: 24px;
     height: 24px;
     fill: currentColor;
     display: inline-block;
   }`;
  }

  _paginationTemplate() {
    const { paginate, itemsPerPage, _startItemLabel, _endItemLabel, _maxItemsLabel, page, outlined, compatibility } = this;
    if (!paginate) {
      return '';
    }
    return html`<div class="table-actions">
      <div class="page-items-count-selector">
        <span class="page-items-count-label">Items per page</span>
        <anypoint-dropdown-menu
          nolabelfloat
          ?outlined="${outlined}"
          ?compatibility="${compatibility}"
        >
          <label slot="label">Select</label>
          <anypoint-listbox
            ?compatibility="${compatibility}"
            slot="dropdown-content"
            attrforselected="data-value"
            .selected="${String(itemsPerPage)}"
            @selected-changed="${this._ippHandler}"
          >
            <anypoint-item data-value="10">10</anypoint-item>
            <anypoint-item data-value="15">15</anypoint-item>
            <anypoint-item data-value="20">20</anypoint-item>
            <anypoint-item data-value="25">25</anypoint-item>
            <anypoint-item data-value="50">50</anypoint-item>
            <anypoint-item data-value="100">100</anypoint-item>
          </anypoint-listbox>
        </anypoint-dropdown-menu>
      </div>
      <div class="page-count">
        ${_startItemLabel}-${_endItemLabel} of ${_maxItemsLabel}
      </div>
      <div class="page-paginators">
        <anypoint-icon-button
          aria-label="Activate to render previous page"
          @click="${this.previousPage}"
          ?disabled="${this._isDisabledPrevious(page)}"
          ?compatibility="${compatibility}">
          <span class="icon">${chevronLeft}</span>
        </anypoint-icon-button>
        <anypoint-icon-button
          aria-label="Activate to render next page"
          @click="${this.nextPage}"
          ?disabled="${this._isDisabledNext(_maxItemsLabel, _endItemLabel)}"
          ?compatibility="${compatibility}">
          <span class="icon">${chevronRight}</span>
        </anypoint-icon-button>
      </div>
    </div>`;
  }

  /**
   * @param {ModelItem[]} display
   * @param {boolean} hasColumns
   * @param {string[]} columns
   * @return {TemplateResult[]} Template for the current object
   */
  _displayTemplate(display, hasColumns, columns) {
    const { paginate, page, itemsPerPage, outlined, compatibility } = this;
    return display.map((displayItem) => html`<tr>
      ${hasColumns ? columns.map((column) => html`<td>
        ${this._isPrimitive(displayItem, column) ?
          html`<json-table-primitive-teaser
            class="primitive-value">${this._getValue(displayItem, column)}</json-table-primitive-teaser>` :
          ''}
        ${this._isObject(displayItem, column) ?
          html`<json-table-object
            .json="${this._getValue(displayItem, column)}"
            ?paginate="${paginate}"
            .page="${page}"
            .itemsPerPage="${itemsPerPage}"
            ?outlined="${outlined}"
            ?compatibility="${compatibility}"></json-table-object>` :
          ''}
        ${this._isEnum(displayItem, column) ?
          this._getValue(displayItem, column).map((item) => html`<span class="enum-value">${item}</span>`) :
          ''}

        ${this._isArray(displayItem, column) ? html`<span class="object-info">
          <span class="object-label" array>Array (${this._computeValueSize(displayItem, column)})</span>
          <a href="#" class="toggle-view" data-target="array" @click="${this._toggleItem}">show array</a></span>
          <json-table-array
            hidden
            .json="${this._getValue(displayItem, column)}"
            ?paginate="${paginate}"
            .page="${page}"
            .itemsPerPage="${itemsPerPage}"
            ?outlined="${outlined}"
            ?compatibility="${compatibility}"></json-table-array>` : ''}
      </td>`) : ''}
    </tr>`);
  }

  /**
   * @return {TemplateResult} Main template
   */
  render() {
    const { _columns, _display } = this;
    const hasColumns = !!(_columns && _columns.length);
    const hasDisplay = !!(_display && _display.length);

    return html`<style>${this.styles}</style>
    ${this._paginationTemplate()}
    <table>
      ${hasColumns ? html`<thead>
        <tr>
        ${_columns.map((item) => html`<th>${item}</th>`)}
        </tr>
      </thead>` : ''}
      <tbody>
        ${hasDisplay ? this._displayTemplate(_display, hasColumns, _columns) : ''}
      </tbody>
    </table>
    ${this._paginationTemplate()}`;
  }

  static get properties() {
    return {
      // An object to render.
      json: { type: Array },
      // List of computed column names
      _columns: { type: Array },
      // data model created from the `json` attribute.
      _display: { type: Array },
      // A label for start index in pagination (1-based)
      _startItemLabel: { type: Number },
      // A label for end index in pagination (1-based)
      _endItemLabel: { type: Number },
      // A label for end index in pagination (1-based)
      _maxItemsLabel: { type: Number }
    };
  }

  get json() {
    return this._json;
  }

  set json(value) {
    const old = this._json;
    if (old === value) {
      return;
    }
    this._json = value;
    this._jsonChanged(value);
    this._computeDisplay();
  }

  get columns() {
    return this._columns;
  }

  /**
   * @returns {boolean}
   */
  get paginate() {
    return this._paginate;
  }

  /**
   * @param {boolean} value
   */
  set paginate(value) {
    const old = this._paginate;
    if (old === value) {
      return;
    }
    this._paginate = value;
    this.requestUpdate('paginate', old);
    this._computeDisplay();
  }

  /**
   * @returns {number}
   */
  get page() {
    return this._page;
  }

  /**
   * @param {number} value
   */
  set page(value) {
    const old = this._page;
    if (old === value) {
      return;
    }
    this._page = value;
    this.requestUpdate('page', old);
    this._computeDisplay();
  }

  /**
   * @returns {number}
   */
  get itemsPerPage() {
    return this._itemsPerPage;
  }

  /**
   * @param {number} value
   */
  set itemsPerPage(value) {
    const old = this._itemsPerPage;
    if (old === value) {
      return;
    }
    this._itemsPerPage = value;
    this.requestUpdate('itemsPerPage', old);
    this._computeDisplay();
  }

  /**
   * Creates a data model from the `json` property.
   *
   * TODO: This should be a deep data observer to update only the portion of the model that
   * actually has changed.
   *
   * @param {Array} json
   */
  _jsonChanged(json) {
    if (!json) {
      this._display = undefined;
      this._columns = undefined;
      return;
    }
    const names = this._computeColumns(json);
    this._columns = names;
  }

  _computeDisplay() {
    const { json, paginate, page, itemsPerPage } = this;
    if (!json) {
      return;
    }
    const maxIndex = json.length - 1;
    if (maxIndex === -1) {
      return;
    }
    if (paginate && maxIndex <= itemsPerPage) {
      this.paginate = false;
      return;
    }
    const startIndex = paginate ? (page * itemsPerPage) : 0;
    if (maxIndex < startIndex) {
      return;
    }
    const endIndex = paginate ? Math.min(startIndex + itemsPerPage - 1, maxIndex) : maxIndex;
    const result = [];
    for (let i = startIndex; i <= endIndex; i++) {
      result.push(this.getItemModel(json[i]));
    }
    this._display = result;
    this._startItemLabel = startIndex + 1;
    this._endItemLabel = Math.min(endIndex + 1, maxIndex);
    this._maxItemsLabel = maxIndex;
  }

  /**
   * Computes the list of column names for the table.
   * It will contain all properties keys fond in the array.
   * @param {any[]} json
   * @return {string[]|null}
   */
  _computeColumns(json) {
    if (this.isEnum(json)) {
      // no column names
      return null;
    }
    const columnNames = [];
    json.forEach((value) => {
      if (this.isObject(value)) {
        const names = Object.keys(value);
        for (let i = 0, len = names.length; i < len; i++) {
          if (columnNames.indexOf(names[i]) === -1) {
            columnNames.push(names[i]);
          }
        }
      }
    });
    return columnNames.length ? columnNames : null;
  }

  /**
   * Checks if passed `item` has value that is a primitive.
   * @param {ModelItem} item
   * @param {string} column Column name
   * @return {Boolean}
   */
  _isPrimitive(item, column) {
    if (!item || !item.value || typeof column === 'undefined') {
      return false;
    }
    if (!(column in item.value)) {
      return false;
    }
    const obj = item.value[column];
    return this.isPrimitive(obj);
  }

  /**
   * Checks if passed `item` has value that is an object.
   * @param {ModelItem} item
   * @param {string} column Column name
   * @return {Boolean}
   */
  _isObject(item, column) {
    if (!item || !item.value || typeof column === 'undefined') {
      return false;
    }
    if (!(column in item.value)) {
      return false;
    }
    const obj = item.value[column];
    return this.isObject(obj);
  }

  /**
   * Checks if passed `item` has value that is an enum.
   * @param {ModelItem} item
   * @param {string} column Column name
   * @return {boolean}
   */
  _isEnum(item, column) {
    if (!item || !item.value || typeof column === 'undefined') {
      return false;
    }
    if (!(column in item.value)) {
      return false;
    }
    const obj = item.value[column];
    return Array.isArray(obj) && this.isEnum(obj);
  }

  /**
   * Checks if passed `item` has value that is an array.
   * @param {ModelItem} item
   * @param {string} column Column name
   * @return {boolean}
   */
  _isArray(item, column) {
    if (!item || !item.value || typeof column === 'undefined') {
      return false;
    }
    if (!(column in item.value)) {
      return false;
    }
    const obj = item.value[column];
    return Array.isArray(obj) && !this.isEnum(obj);
  }

  /**
   * @param {ModelItem} item
   * @param {string} column Column name
   * @return {any}
   */
  _getValue(item, column) {
    if (!item || !item.value || typeof column === 'undefined') {
      return undefined;
    }
    if (!(column in item.value)) {
      return undefined;
    }
    return item.value[column];
  }

  /**
   * @param {PointerEvent} e
   */
  _toggleItem(e) {
    e.preventDefault();
    let cell;
    let currentElement = /** @type HTMLElement */ (e.target);
    const targetAnchor = /** @type HTMLAnchorElement */ (e.target);
    const templateTarget = currentElement.dataset.target;
    const test = true;
    while (test) {
      if (currentElement.nodeName === 'TD') {
        cell = currentElement;
        break;
      }
      currentElement = currentElement.parentElement;
      if (!currentElement) {
        throw new Error('Couldn\'t find table cell in the event path.');
      }
    }
    const node = cell.querySelector(`json-table-array`);
    const label = cell.querySelector(`.object-label[${templateTarget}]`);
    if (node.hasAttribute('hidden')) {
      node.removeAttribute('hidden');
      targetAnchor.textContent = `hide ${templateTarget}`;
      label.setAttribute('hidden', 'true');
      targetAnchor.classList.add('active');
    } else {
      node.setAttribute('hidden', '');
      targetAnchor.textContent = `show ${templateTarget}`;
      label.removeAttribute('hidden');
      targetAnchor.classList.remove('active');
    }
  }

  /**
   * When pagination is enabled this will increase page number.
   * This will do nothing if pagination isn't enabled or there's no next page of results to
   * display.
   * @return {boolean}
   */
  nextPage() {
    const maxIndex = this._maxItemsLabel;
    const endIndex = this._endItemLabel;
    if (maxIndex <= endIndex) {
      return false;
    }
    this.page++;
    return true;
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
   * @param {number} page Current page index
   * @return {boolean} true if there's previous page of the results
   */
  _isDisabledPrevious(page) {
    return page === 0;
  }

  _isDisabledNext(maxItemsLabel, endItemLabel) {
    if (maxItemsLabel <= endItemLabel) {
      return true;
    }
    return false;
  }

  _computeValueSize(item, column) {
    const value = this._getValue(item, column);
    return value && value.length || 0;
  }

  _ippHandler(e) {
    this.itemsPerPage = e.detail.value;
  }
}
