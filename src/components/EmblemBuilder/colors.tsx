import classnames from 'classnames';
import { every, includes, intersection, map, reject } from 'lodash';
import React, { useState } from 'react';
import { MdClear, MdWarning } from 'react-icons/md';
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

type Category = string;
type CategoryTypes = keyof typeof categoryTypes;

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
  const [categoryFilters, setCategoryFilters] = useState<string[]>(['Starter']);

  const handleFilterClick = (newState: boolean | null, category: Category | null, categoryType: CategoryTypes) => {
    const typeCategories = categoryTypes[categoryType];

    return setCategoryFilters((currentState) => {
      currentState = reject(currentState, (c) => typeCategories.includes(c));

      if (newState && category) {
        return [...currentState, category];
      } else {
        return currentState;
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
  categoryFilters: Category[];
  onSelect: (newState: boolean | null, category: Category | null, categoryType: CategoryTypes) => void;
}
const ColorFilters: React.FC<IColorFiltersProps> = ({ categoryFilters, onSelect }) => {
  return (
    <div className="mx-auto flex w-fit flex-row flex-wrap gap-8 pt-2">
      {map(categoryTypes, (typeCategories: Category[], categoryType: CategoryTypes) => {
        const hasActive = intersection(typeCategories, categoryFilters).length > 0;

        return (
          <div key={categoryType} className="flex flex-row gap-2">
            {hasActive ? (
              <MdClear
                className="cursor-pointer text-neutral-300"
                title={`Clear ${categoryType}`}
                onClick={() => onSelect(null, null, categoryType)}
              />
            ) : null}
            {typeCategories.map((category) => {
              const isActive = categoryFilters.includes(category);
              const filterClassName = classnames({
                'font-bold  ': isActive && categoryFilters.length !== 0,
              });

              return (
                <React.Fragment key={category}>
                  {category === 'Starter' && isActive === false ? (
                    <MdWarning className="text-red-800" title="Only starter colors are available in game" />
                  ) : null}
                  <button
                    className={` text-xs  ${filterClassName}`}
                    onClick={() => onSelect(!isActive, category, categoryType)}
                  >
                    {category}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
