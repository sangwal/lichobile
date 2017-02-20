import i18n from '../../i18n';
import redraw from '../../utils/redraw';
import * as h from 'mithril/hyperscript';
import { SettingsProp } from '../../settings';

type SelectOption = string[]
type SelectOptionGroup = Array<SelectOption>;

function renderOption(label: string, value: string, storedValue: string, labelArg: string, labelArg2: string) {
  return h('option', {
    key: value,
    value: value,
    selected: storedValue === value
  }, i18n(label, labelArg, labelArg2));
}


function renderOptionGroup(label:string, value:string | SelectOptionGroup, storedValue:string, labelArg:string, labelArg2:string): Mithril.Children {
  if (typeof value === 'string') {
    return renderOption(label, value, storedValue, labelArg, labelArg2);
  }
  else {
    return h('optgroup', {
      key: label,
      label
    }, value.map(e => renderOption(e[0], e[1], storedValue, e[2], e[3])));
  }
}

export default {

  renderRadio(
    label: string,
    name: string,
    value: string,
    checked: boolean,
    onchange: (e: Event) => void,
    disabled?: boolean
  ) {
    const id = name + '_' + value;
    return [
      h('input.radio[type=radio]', {
        name,
        id,
        className: value,
        value,
        checked,
        onchange,
        disabled
      }),
      h('label', {
        'for': id
      }, i18n(label))
    ];
  },

  renderSelect(
    label: string,
    name: string,
    options: Array<SelectOption>,
    settingsProp: SettingsProp<string>,
    isDisabled?: boolean,
    onChangeCallback?: (v: string) => void
  ) {
    const storedValue = settingsProp();
    return [
      h('label', {
        'for': 'select_' + name
      }, i18n(label)),
      h('select', {
        id: 'select_' + name,
        disabled: isDisabled,
        onchange(e: Event) {
          const val = (e.target as HTMLSelectElement).value;
          settingsProp(val);
          if (onChangeCallback) onChangeCallback(val);
          setTimeout(() => redraw(), 10);
        }
      }, options.map(e => renderOption(e[0], e[1], storedValue, e[2], e[3])))
    ];
  },

  renderCheckbox(
    label: string,
    name: string,
    settingsProp: SettingsProp<boolean>,
    callback?: (v: boolean) => void,
    disabled?: boolean
  ) {
    const isOn = settingsProp();
    return h('div.check_container', {
      className: disabled ? 'disabled' : ''
    }, [
      h('label', {
        'for': name
      }, label),
      h('input[type=checkbox]', {
        name: name,
        disabled,
        checked: isOn,
        onchange: function() {
          const newVal = !isOn;
          settingsProp(newVal);
          if (callback) callback(newVal);
          redraw();
        }
      })
    ]);
  },

  renderSelectWithGroup(
    label: string,
    name: string,
    options: Array<Array<string | SelectOptionGroup>>,
    settingsProp: SettingsProp<string>,
    isDisabled?: boolean,
    onChangeCallback?: (v: string) => void
  ) {
    const storedValue = settingsProp();
    return [
      h('label', {
        'for': 'select_' + name
      }, i18n(label)),
      h('select', {
        id: 'select_' + name,
        disabled: isDisabled,
        onchange(e: Event) {
          const val = (e.target as HTMLSelectElement).value;
          settingsProp(val);
          if (onChangeCallback) onChangeCallback(val);
          setTimeout(() => redraw(), 10);
        }
      }, options.map(e => renderOptionGroup(e[0] as string, e[1], storedValue, e[2] as string, e[3] as string)))
    ];
  }
};
