import React, { useRef, useEffect } from 'react';

/** Single-line or multiline text field */
export function TextField({ label, value, onChange, multiline, rows, placeholder }) {
  return (
    <div className="field">
      {label && <label className="field__label">{label}</label>}
      {multiline ? (
        <textarea
          className="field__textarea"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={rows || 3}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          className="field__input"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

/** Image field with URL input + file upload (with blob URL memory cleanup) */
export function ImageField({ label, value, onChange, heroAspect }) {
  const prevBlobUrl = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (prevBlobUrl.current?.startsWith('blob:')) {
      URL.revokeObjectURL(prevBlobUrl.current);
    }
    const url = URL.createObjectURL(file);
    prevBlobUrl.current = url;
    onChange(url);
    e.target.value = '';
  };

  // Revoke on unmount
  useEffect(() => {
    return () => {
      if (prevBlobUrl.current?.startsWith('blob:')) {
        URL.revokeObjectURL(prevBlobUrl.current);
      }
    };
  }, []);

  return (
    <div className="field">
      {label && <div className="field__label">{label}</div>}
      {value && (
        <img
          src={value}
          alt=""
          className={`image-field__preview${heroAspect ? ' image-field__preview--hero' : ''}`}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}
      <div className="image-field__row">
        <input
          type="text"
          className="field__input"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL (Unsplash, etc.)"
        />
        <label className="btn btn--ghost btn--sm image-field__upload-btn">
          Upload
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{ display: 'none' }}
          />
        </label>
      </div>
    </div>
  );
}

/** Editable list of strings (destinations, inclusions, etc.) */
export function ArrayField({ label, items, onChange, onAdd, onRemove, placeholder }) {
  return (
    <div className="field">
      {label && <div className="field__label">{label}</div>}
      <div className="array-field__list">
        {items.map((item, i) => (
          <div key={i} className="array-field__item">
            <input
              type="text"
              className="field__input"
              value={item ?? ''}
              onChange={(e) => onChange(i, e.target.value)}
              placeholder={placeholder}
            />
            <button
              className="array-field__remove"
              onClick={() => onRemove(i)}
              type="button"
              aria-label="Remove item"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button className="array-field__add" onClick={onAdd} type="button">
        + Add Item
      </button>
    </div>
  );
}
