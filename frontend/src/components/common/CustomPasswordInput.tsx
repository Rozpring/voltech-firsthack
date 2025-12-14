// カスタムパスワード入力コンポーネント - 画像を伏字として使用

import React, { useState, useRef } from 'react';
import PasswordMaskImage from '../../assets/password-mask.png';

interface CustomPasswordInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
}

export const CustomPasswordInput: React.FC<CustomPasswordInputProps> = ({
    value,
    onChange,
    placeholder = 'パスワードを入力',
    className = '',
    required = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    // コンテナクリック時に非表示のinputにフォーカス
    const handleContainerClick = () => {
        hiddenInputRef.current?.focus();
    };

    // マスク画像を表示
    const renderMaskImages = () => {
        if (value.length === 0) {
            return null;
        }
        return (
            <div className="flex items-center space-x-1">
                {Array.from({ length: value.length }).map((_, index) => (
                    <img
                        key={index}
                        src={PasswordMaskImage}
                        alt="●"
                        style={{ width: '50px', height: '50px' }}
                        className="object-contain"
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="relative">
            {/* 非表示の実際のinput */}
            <input
                ref={hiddenInputRef}
                type="password"
                value={value}
                onChange={onChange}
                required={required}
                className="absolute inset-0 opacity-0 w-full h-full cursor-text"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />

            {/* 表示用のコンテナ */}
            <div
                onClick={handleContainerClick}
                className={`
                    w-full px-3 py-2 border rounded-md cursor-text
                    min-h-[42px] flex items-center
                    ${isFocused
                        ? 'border-transparent ring-2 ring-indigo-500'
                        : 'border-slate-300'
                    }
                    ${className}
                `}
            >
                {value.length === 0 ? (
                    <span className="text-slate-400">{placeholder}</span>
                ) : (
                    renderMaskImages()
                )}
            </div>
        </div>
    );
};
