import Image from 'next/image';
import {
  MdArrowLeft,
  MdArrowRight,
  MdBlock,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdChevronLeft,
  MdClear,
  MdMenu,
  MdShuffle,
} from 'react-icons/md';
import { IColor } from '~/lib/emblem/resources';
import { Portal } from '../layout/Portal';

export interface ILayerPreviewProps {
  url: string | null;
  size: string;
  onClick: () => void;
  onPrev: () => void;
  onNext: () => void;
  onClear: () => void;
  onRandom: () => void;
}

export const LayerPreview: React.FC<ILayerPreviewProps> = ({ url, size, onClick, onPrev, onNext, onClear, onRandom }) => (
  <div className="">
    <div className="cursor-pointer rounded hover:bg-zinc-50" onClick={onClick}>
      {url ? (
        <Image unoptimized alt="selected" src={url} width={size} height={size} layout={'responsive'} />
      ) : (
        <MdBlock size={size} opacity=".2" />
      )}
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
  <div className="flex min-w-[192px] shrink-0 flex-col gap-4 px-1">{children}</div>
);

export interface IPickerDialogProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  subHeader?: React.ReactNode;
  onClose: () => void;
}
export const PickerDialog: React.FC<IPickerDialogProps> = ({ title, children, subHeader, onClose }) => (
  <Portal>
    <div className="fixed inset-0 z-50 bg-white">
      <div className={`flex h-full w-full flex-col`}>
        <header className="flex flex-row items-center justify-start gap-4 border-b p-4 px-6 ">
          <div className="flex-none">
            <MdChevronLeft className="cursor-pointer text-4xl text-zinc-600" onClick={onClose} />
          </div>
          <h1 className="flex-auto text-xl">{title}</h1>
        </header>
        {subHeader ? <div className="flex-none  p-2 ">{subHeader}</div> : null}
        <div className={`${subHeader ? '' : 'pt-2'} flex flex-auto flex-col overflow-x-scroll overscroll-none pb-4`}>
          <ul className="flex flex-auto flex-wrap justify-center">{children}</ul>
        </div>
      </div>
    </div>
  </Portal>
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
  label: React.ReactNode;
  isEnabled: boolean;
  onClick: () => void;
}
export const FlagToggle: React.FC<IFlagToggleProps> = ({ label, isEnabled, onClick }) => {
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
