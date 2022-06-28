import classnames from 'classnames';
import { every, includes, map } from 'lodash';
import { useState } from 'react';
import {
  MdArrowLeft,
  MdArrowRight,
  MdBlock,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdClear,
  MdClose,
  MdMenu,
  MdShuffle,
} from 'react-icons/md';
import { EMBLEM_SWATCH_SIZE } from '~/lib/emblem/constants';
import { colors, IColor } from '~/lib/emblem/resources';
import { getEmblemUrl } from '~/lib/emblem/url';
import { IGuildEmblem } from '~/types/Guild';

export interface ILayerPreviewProps {
  url: string | null;
  size: string;
  onClick: () => void;
  onPrev: () => void;
  onNext: () => void;
  onClear: () => void;
  onRandom: () => void;
}

export const LayerPreview: React.FC<ILayerPreviewProps> = ({
  url,
  size,
  onClick,
  onPrev,
  onNext,
  onClear,
  onRandom,
}) => (
  <div className="rounded-md bg-zinc-200">
    <div className="cursor-pointer" onClick={onClick}>
      {url ? <img src={url} width={size} height={size} /> : <MdBlock size={size} opacity=".2" />}
    </div>
    <div className="mx-auto flex flex-row justify-center gap-1 text-xl">
      <MdArrowLeft title="Previous" onClick={onPrev} className="cursor-pointer" />
      <MdClear title="Clear" onClick={onClear} className="cursor-pointer" />
      <MdMenu title="Pick" onClick={onClick} className="cursor-pointer" />
      <MdShuffle title="Random" onClick={onRandom} className="cursor-pointer" />
      <MdArrowRight title="Next" onClick={onNext} className="cursor-pointer" />
    </div>
  </div>
);

export interface ILayerOptionsProps {
  children: React.ReactNode;
}
export const LayerOptions: React.FC<ILayerOptionsProps> = ({ children }) => (
  <div className="flex shrink-0 flex-col gap-4 px-1">{children}</div>
);

export interface IPickerDialogProps {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
}
export const PickerDialog: React.FC<IPickerDialogProps> = ({ title, children, onClose }) => (
  <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex content-center p-8">
    <div className="mx-auto flex max-h-full flex-col rounded-md  bg-zinc-50 pb-4 shadow-lg">
      <header className="flex w-full grow-0 flex-row items-center justify-between rounded-md rounded-b-none bg-zinc-100 px-4 py-2">
        <h1 className="text-xl">{title}</h1>
        <div>
          <MdClose size="32" className="cursor-pointer" onClick={onClose} />
        </div>
      </header>
      <div className="grow-1 mx-auto overflow-auto p-4">
        <ul className=" flex flex-wrap justify-center ">{children}</ul>
      </div>
    </div>
  </div>
);

export interface IColorSwatchProps {
  color: IColor;
  label?: string;
  onClick: () => void;
}
export const ColorSwatch: React.FC<IColorSwatchProps> = ({ color, label, onClick }) => (
  <div onClick={onClick} className="flex w-full cursor-pointer flex-col items-center justify-between gap-1 py-1">
    <div
      style={{ backgroundColor: `rgb(${color.cloth.rgb.join(',')})` }}
      className="h-12 w-full shrink-0 rounded-sm"
    ></div>
    <div className="leading-0 max-w-full  px-2 text-center text-xs">{label ?? color.name}</div>
  </div>
);

export interface IFlagToggleProps {
  icon: React.ReactElement;
  label: React.ReactNode;
  isEnabled: boolean;
  onClick: () => void;
}
export const FlagToggle: React.FC<IFlagToggleProps> = ({ icon, label, isEnabled, onClick }) => {
  const CheckboxIcon = isEnabled ? MdCheckBox : MdCheckBoxOutlineBlank;

  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer select-none flex-row items-center gap-2 px-1 text-sm leading-none`}
    >
      <CheckboxIcon size="18" className="" />
      <div className="">{label}</div>
    </div>
  );
};
