'use client';
import ReactSelect, { GroupBase, Props } from 'react-select';

// Drop-in replacement for react-select that adds classNamePrefix="rs"
// so that globals.scss can reliably target .rs__* classes for dark mode.
function DarkSelect<
    Option = unknown,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
    return <ReactSelect classNamePrefix="rs" {...props} />;
}

export default DarkSelect;
