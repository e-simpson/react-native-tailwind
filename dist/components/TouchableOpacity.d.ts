/**
 * Enhanced TouchableOpacity component with modifier support
 * Adds active state support for active: modifier via onPressIn/onPressOut
 */
import { type TouchableOpacityProps as RNTouchableOpacityProps, type StyleProp, type ViewStyle } from "react-native";
type TouchableOpacityState = {
    active: boolean;
    disabled: boolean | null | undefined;
};
export type TouchableOpacityProps = Omit<RNTouchableOpacityProps, "style"> & {
    /**
     * Style can be a static style object/array or a function that receives TouchableOpacity state
     */
    style?: StyleProp<ViewStyle> | ((state: TouchableOpacityState) => StyleProp<ViewStyle>);
    className?: string;
};
/**
 * Enhanced TouchableOpacity that supports active: and disabled: modifiers
 *
 * @example
 * <TouchableOpacity
 *   disabled={isLoading}
 *   className="bg-blue-500 active:bg-blue-700 disabled:bg-gray-400"
 * >
 *   <Text>Submit</Text>
 * </TouchableOpacity>
 */
export declare const TouchableOpacity: import("react").ForwardRefExoticComponent<Omit<RNTouchableOpacityProps, "style"> & {
    /**
     * Style can be a static style object/array or a function that receives TouchableOpacity state
     */
    style?: StyleProp<ViewStyle> | ((state: TouchableOpacityState) => StyleProp<ViewStyle>);
    className?: string;
} & import("react").RefAttributes<import("react-native").View>>;
export {};
