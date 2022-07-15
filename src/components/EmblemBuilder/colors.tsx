import classnames from 'classnames';
import { every, includes, map } from 'lodash';
import { useState } from 'react';
import { EMBLEM_SWATCH_SIZE } from '~/lib/emblem/constants';
import { colors, IColor } from '~/lib/emblem/resources';
import { IGuildEmblem } from '~/types/Guild';
import { EmblemSVG } from '../EmblemSVG';
import { ColorSwatch, PickerDialog } from './utils';

const categoryTypes = {
  Rarity: ['Starter', 'Common', 'Uncommon', 'Rare'],
  Material: ['Vibrant', 'Metal', 'Leather'],
  Color: ['Gray', 'Blue', 'Orange', 'Brown', 'Red', 'Purple', 'Green', 'Yellow'].sort(),
};

export interface IColorSelectionProps {
  title: string;
  currentColor: IColor;
  emblem: IGuildEmblem;
  colorKey: 'background_color_id' | 'foreground_primary_color_id' | 'foreground_secondary_color_id';
  onClick: (id: number) => void;
}

export const ColorSelection: React.FC<IColorSelectionProps> = ({ title, currentColor, emblem, colorKey, onClick }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const handleColorPicker = (colorId: number) => {
    handleClose();
    return onClick(colorId);
  };
  const handleClose = () => setShowColorPicker(false);

  return (
    <div>
      <ColorSwatch
        color={currentColor}
        onClick={() => setShowColorPicker(!showColorPicker)}
        label={currentColor.name}
      />
      {showColorPicker && (
        <ColorPicker
          title={title}
          currentColor={currentColor}
          onChange={handleColorPicker}
          emblem={emblem}
          colorKey={colorKey}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export interface IColorPickerProps {
  title: string;
  currentColor: IColor;
  emblem: IGuildEmblem;
  colorKey: 'background_color_id' | 'foreground_primary_color_id' | 'foreground_secondary_color_id';
  onChange: (colorId: number) => void;
  onClose: () => void;
}
export const ColorPicker: React.FC<IColorPickerProps> = ({
  title,
  currentColor,
  emblem,
  colorKey,
  onChange,
  onClose,
}) => {
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);

  const handleFilterClick = (category: string) => {
    return setCategoryFilters((currentState) => {
      if (currentState.includes(category)) {
        return currentState.filter((c) => c !== category);
      } else {
        return [...currentState, category];
      }
    });
  };
  return (
    <PickerDialog
      title={
        <div className="flex flex-auto flex-row justify-between">
          <div>{title}</div>
          <div
            onClick={onClose}
            className={`cursor-pointer rounded-md border border-r-[128px]`}
            style={{ borderColor: `rgb(${currentColor.cloth.rgb.join(',')})` }}
          >
            <div className="p-2 pl-4 pr-8 text-center text-xs">{currentColor.name}</div>
          </div>
        </div>
      }
      onClose={onClose}
      subHeader={<ColorFilters categoryFilters={categoryFilters} onSelect={handleFilterClick} />}
    >
      {colors
        .filter((color) => {
          if (!categoryFilters.length) {
            return true;
          }
          return every(categoryFilters, (colorCat) => includes(color.categories, colorCat));
        })
        .map((color: IColor) => {
          const emblemParams = { ...emblem, [colorKey]: color.id, size: Number(EMBLEM_SWATCH_SIZE) };

          return (
            <li key={color.id} className="p-1 " onClick={() => onChange(color.id)}>
              <div
                className="flex cursor-pointer flex-col gap-1 rounded-md border border-b-[32px] hover:bg-zinc-50 hover:shadow-md"
                style={{ borderColor: `rgb(${color.cloth.rgb.join(',')})` }}
              >
                <EmblemSVG emblem={emblemParams} title={color.name} />
                <div className="p-1 text-center text-xs">{color.name}</div>
              </div>
            </li>
          );
        })}
    </PickerDialog>
  );
};

interface IColorFiltersProps {
  categoryFilters: string[];
  onSelect: (category: string) => void;
}
const ColorFilters: React.FC<IColorFiltersProps> = ({ categoryFilters, onSelect }) => {
  return (
    <div className="mx-auto flex w-fit flex-row flex-wrap gap-8 pt-2">
      {map(categoryTypes, (v, k) => {
        return (
          <div key={k} className="flex flex-row gap-2">
            {v.map((category) => {
              const isActive = categoryFilters.includes(category);
              const filterClassName = classnames({
                'font-bold  ': isActive && categoryFilters.length !== 0,
              });

              return (
                <button key={category} className={` text-xs  ${filterClassName}`} onClick={() => onSelect(category)}>
                  {category}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
