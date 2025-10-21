import type { ItemJSON } from '@text-game/shared';
import React from 'react';

interface Props {
  inventory?: ItemJSON[];
}

export const InventoryCard: React.FC<Props> = ({ inventory }) => {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h3 className="card-title">Inventory</h3>
        <div className="flex flex-wrap gap-2">
          {(inventory ?? []).map((item, i) => (
            <div
              key={item.id + i}
              className={`badge ${getItemColor(item)} badge-lg`}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function getItemColor(item: ItemJSON) {
  switch (item.type) {
    case 'consumable':
      return 'badge-success';
    case 'equippable':
      return 'badge-warning';
    case 'functional':
      return 'badge-info';
    case 'material':
      return 'badge-ghost';
    default:
      return 'badge-secondary';
  }
}
