// Geolocation hook for getting user's current position

import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    error: string | null;
    loading: boolean;
}

interface UseGeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    watch?: boolean;  // 位置を継続的に監視するかどうか
}

const defaultOptions: UseGeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
    watch: false,
};

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
    const mergedOptions = { ...defaultOptions, ...options };

    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: null,
        loading: false,
    });

    const handleSuccess = useCallback((position: GeolocationPosition) => {
        setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            error: null,
            loading: false,
        });
    }, []);

    const handleError = useCallback((error: GeolocationPositionError) => {
        let errorMessage = '位置情報の取得に失敗しました';

        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = '位置情報へのアクセスが拒否されました';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = '位置情報が利用できません';
                break;
            case error.TIMEOUT:
                errorMessage = '位置情報の取得がタイムアウトしました';
                break;
        }

        setState(prev => ({
            ...prev,
            error: errorMessage,
            loading: false,
        }));
    }, []);

    const getCurrentPosition = useCallback(() => {
        if (!navigator.geolocation) {
            setState(prev => ({
                ...prev,
                error: 'お使いのブラウザは位置情報をサポートしていません',
                loading: false,
            }));
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            handleSuccess,
            handleError,
            {
                enableHighAccuracy: mergedOptions.enableHighAccuracy,
                timeout: mergedOptions.timeout,
                maximumAge: mergedOptions.maximumAge,
            }
        );
    }, [handleSuccess, handleError, mergedOptions.enableHighAccuracy, mergedOptions.timeout, mergedOptions.maximumAge]);

    // 位置の監視（watch: true の場合）
    useEffect(() => {
        if (!mergedOptions.watch || !navigator.geolocation) return;

        setState(prev => ({ ...prev, loading: true }));

        const watchId = navigator.geolocation.watchPosition(
            handleSuccess,
            handleError,
            {
                enableHighAccuracy: mergedOptions.enableHighAccuracy,
                timeout: mergedOptions.timeout,
                maximumAge: mergedOptions.maximumAge,
            }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [mergedOptions.watch, handleSuccess, handleError, mergedOptions.enableHighAccuracy, mergedOptions.timeout, mergedOptions.maximumAge]);

    return {
        ...state,
        getCurrentPosition,
        isSupported: 'geolocation' in navigator,
    };
};
