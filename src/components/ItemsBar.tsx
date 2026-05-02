import { Item, ThemeColors } from '../types/game';

interface ItemsBarProps {
  items: Item[];
  selectedItem: string | null;
  onUseItem: (type: any) => void;
  onCancelItem: () => void;
  colors: ThemeColors;
}

export function ItemsBar({ items, selectedItem, onUseItem, onCancelItem, colors }: ItemsBarProps) {
  return (
    <div className="items-bar">
      {items.map(item => {
        const isDisabled = item.count <= 0;
        const isSelected = selectedItem === item.type;
        const className = `item ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`;

        return (
          <div
            key={item.type}
            className={className}
            style={{
              borderColor: isSelected ? colors.highlight : colors.cellBorder,
              background: isSelected ? `${colors.highlight}22` : colors.cell,
            }}
            onClick={() => {
              if (!isDisabled) {
                if (isSelected) {
                  onCancelItem();
                } else {
                  onUseItem(item.type);
                }
              }
            }}
          >
            <span className="item-icon">{item.icon}</span>
            <span className="item-count" style={{ color: colors.text }}>
              x{item.count}
            </span>
            <span className="item-name" style={{ color: colors.text }}>
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
