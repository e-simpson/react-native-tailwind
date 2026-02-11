/**
 * Enhanced TextInput component with focus state support for focus: modifier
 *
 * This component wraps React Native's TextInput and manages focus state internally,
 * allowing the style prop to be a function that receives { focused: boolean }.
 *
 * @example
 * ```tsx
 * import { TextInput } from '@mgcrea/react-native-tailwind';
 *
 * <TextInput
 *   className="border-2 border-gray-300 focus:border-blue-500 p-3 rounded-lg"
 *   placeholder="Email"
 * />
 * ```
 */
import { type BlurEvent, type FocusEvent, TextInput as RNTextInput, type TextInputProps as RNTextInputProps } from "react-native";
import { type Simplify } from "../types/util";
export type TextInputProps = Simplify<Omit<RNTextInputProps, "style"> & {
    /**
     * Style can be a static style object/array or a function that receives focus and disabled state
     */
    style?: RNTextInputProps["style"] | ((state: {
        focused: boolean;
        disabled: boolean;
    }) => RNTextInputProps["style"]);
    className?: string;
    /**
     * Convenience prop for disabled state (overrides editable if provided)
     * When true, sets editable to false
     */
    disabled?: boolean;
}>;
/**
 * Enhanced TextInput with focus and disabled state support
 *
 * Manages focus state internally and passes it to style functions,
 * enabling the use of focus: and disabled: modifiers in className.
 *
 * Note: TextInput uses `editable` prop internally. You can pass either:
 * - `disabled={true}` - convenience prop (sets editable to false)
 * - `editable={false}` - React Native's native prop
 * If both are provided, `disabled` takes precedence.
 */
export declare const TextInput: import("react").ForwardRefExoticComponent<{
    value?: string | undefined | undefined;
    textAlign?: "left" | "center" | "right" | undefined | undefined;
    placeholder?: string | undefined | undefined;
    children?: import("react").ReactNode;
    hitSlop?: number | import("react-native").Insets | null | undefined;
    id?: string | undefined | undefined;
    needsOffscreenAlphaCompositing?: boolean | undefined | undefined;
    onLayout?: ((event: import("react-native").LayoutChangeEvent) => void) | undefined | undefined;
    pointerEvents?: "box-none" | "none" | "box-only" | "auto" | undefined | undefined;
    removeClippedSubviews?: boolean | undefined | undefined;
    testID?: string | undefined | undefined;
    nativeID?: string | undefined | undefined;
    collapsable?: boolean | undefined | undefined;
    collapsableChildren?: boolean | undefined | undefined;
    className?: string | undefined;
    onBlur?: ((e: BlurEvent) => void) | undefined | undefined;
    onFocus?: ((e: FocusEvent) => void) | undefined | undefined;
    renderToHardwareTextureAndroid?: boolean | undefined | undefined;
    focusable?: boolean | undefined | undefined;
    tabIndex?: 0 | -1 | undefined | undefined;
    shouldRasterizeIOS?: boolean | undefined | undefined;
    isTVSelectable?: boolean | undefined | undefined;
    hasTVPreferredFocus?: boolean | undefined | undefined;
    tvParallaxShiftDistanceX?: number | undefined | undefined;
    tvParallaxShiftDistanceY?: number | undefined | undefined;
    tvParallaxTiltAngle?: number | undefined | undefined;
    tvParallaxMagnification?: number | undefined | undefined;
    onStartShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined | undefined;
    onMoveShouldSetResponder?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined | undefined;
    onResponderEnd?: ((event: import("react-native").GestureResponderEvent) => void) | undefined | undefined;
    onResponderGrant?: ((event: import("react-native").GestureResponderEvent) => void) | undefined | undefined;
    onResponderReject?: ((event: import("react-native").GestureResponderEvent) => void) | undefined | undefined;
    onResponderMove?: ((event: import("react-native").GestureResponderEvent) => void) | undefined | undefined;
    onResponderRelease?: ((event: import("react-native").GestureResponderEvent) => void) | undefined | undefined;
    onResponderStart?: ((event: import("react-native").GestureResponderEvent) => void) | undefined | undefined;
    onResponderTerminationRequest?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined | undefined;
    onResponderTerminate?: ((event: import("react-native").GestureResponderEvent) => void) | undefined | undefined;
    onStartShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined | undefined;
    onMoveShouldSetResponderCapture?: ((event: import("react-native").GestureResponderEvent) => boolean) | undefined | undefined;
    onTouchStart?: ((event: import("react-native").GestureResponderEvent) => void) | undefined | undefined;
    onTouchMove?: ((event: import("react-native").GestureResponderEvent) => void) | undefined | undefined;
    onTouchEnd?: ((event: import("react-native").GestureResponderEvent) => void) | undefined | undefined;
    onTouchCancel?: ((event: import("react-native").GestureResponderEvent) => void) | undefined | undefined;
    onTouchEndCapture?: ((event: import("react-native").GestureResponderEvent) => void) | undefined | undefined;
    onPointerEnter?: ((event: import("react-native").PointerEvent) => void) | undefined | undefined;
    onPointerEnterCapture?: ((event: import("react-native").PointerEvent) => void) | undefined | undefined;
    onPointerLeave?: ((event: import("react-native").PointerEvent) => void) | undefined | undefined;
    onPointerLeaveCapture?: ((event: import("react-native").PointerEvent) => void) | undefined | undefined;
    onPointerMove?: ((event: import("react-native").PointerEvent) => void) | undefined | undefined;
    onPointerMoveCapture?: ((event: import("react-native").PointerEvent) => void) | undefined | undefined;
    onPointerCancel?: ((event: import("react-native").PointerEvent) => void) | undefined | undefined;
    onPointerCancelCapture?: ((event: import("react-native").PointerEvent) => void) | undefined | undefined;
    onPointerDown?: ((event: import("react-native").PointerEvent) => void) | undefined | undefined;
    onPointerDownCapture?: ((event: import("react-native").PointerEvent) => void) | undefined | undefined;
    onPointerUp?: ((event: import("react-native").PointerEvent) => void) | undefined | undefined;
    onPointerUpCapture?: ((event: import("react-native").PointerEvent) => void) | undefined | undefined;
    accessible?: boolean | undefined | undefined;
    accessibilityActions?: readonly Readonly<{
        name: import("react-native").AccessibilityActionName | string;
        label?: string | undefined;
    }>[] | undefined;
    accessibilityLabel?: string | undefined | undefined;
    'aria-label'?: string | undefined | undefined;
    accessibilityRole?: import("react-native").AccessibilityRole | undefined;
    accessibilityState?: import("react-native").AccessibilityState | undefined;
    'aria-busy'?: boolean | undefined | undefined;
    'aria-checked'?: boolean | "mixed" | undefined | undefined;
    'aria-disabled'?: boolean | undefined | undefined;
    'aria-expanded'?: boolean | undefined | undefined;
    'aria-selected'?: boolean | undefined | undefined;
    accessibilityHint?: string | undefined | undefined;
    accessibilityValue?: import("react-native").AccessibilityValue | undefined;
    'aria-valuemax'?: number | undefined;
    'aria-valuemin'?: number | undefined;
    'aria-valuenow'?: number | undefined;
    'aria-valuetext'?: string | undefined;
    onAccessibilityAction?: ((event: import("react-native").AccessibilityActionEvent) => void) | undefined | undefined;
    importantForAccessibility?: ("auto" | "yes" | "no" | "no-hide-descendants") | undefined | undefined;
    'aria-hidden'?: boolean | undefined | undefined;
    'aria-modal'?: boolean | undefined | undefined;
    role?: import("react-native").Role | undefined;
    accessibilityLabelledBy?: string | string[] | undefined | undefined;
    'aria-labelledby'?: string | undefined | undefined;
    accessibilityLiveRegion?: "none" | "polite" | "assertive" | undefined | undefined;
    'aria-live'?: ("polite" | "assertive" | "off") | undefined | undefined;
    screenReaderFocusable?: boolean | undefined | undefined;
    accessibilityElementsHidden?: boolean | undefined | undefined;
    accessibilityViewIsModal?: boolean | undefined | undefined;
    onAccessibilityEscape?: (() => void) | undefined | undefined;
    onAccessibilityTap?: (() => void) | undefined | undefined;
    onMagicTap?: (() => void) | undefined | undefined;
    accessibilityIgnoresInvertColors?: boolean | undefined | undefined;
    accessibilityLanguage?: string | undefined | undefined;
    accessibilityShowsLargeContentViewer?: boolean | undefined | undefined;
    accessibilityLargeContentTitle?: string | undefined | undefined;
    accessibilityRespondsToUserInteraction?: boolean | undefined | undefined;
    onPress?: ((e: import("react-native").NativeSyntheticEvent<import("react-native").NativeTouchEvent>) => void) | undefined | undefined;
    onPressIn?: ((e: import("react-native").NativeSyntheticEvent<import("react-native").NativeTouchEvent>) => void) | undefined | undefined;
    onPressOut?: ((e: import("react-native").NativeSyntheticEvent<import("react-native").NativeTouchEvent>) => void) | undefined | undefined;
    allowFontScaling?: boolean | undefined | undefined;
    autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined | undefined;
    autoComplete?: "additional-name" | "address-line1" | "address-line2" | "birthdate-day" | "birthdate-full" | "birthdate-month" | "birthdate-year" | "cc-csc" | "cc-exp" | "cc-exp-day" | "cc-exp-month" | "cc-exp-year" | "cc-number" | "cc-name" | "cc-given-name" | "cc-middle-name" | "cc-family-name" | "cc-type" | "country" | "current-password" | "email" | "family-name" | "gender" | "given-name" | "honorific-prefix" | "honorific-suffix" | "name" | "name-family" | "name-given" | "name-middle" | "name-middle-initial" | "name-prefix" | "name-suffix" | "new-password" | "nickname" | "one-time-code" | "organization" | "organization-title" | "password" | "password-new" | "postal-address" | "postal-address-country" | "postal-address-extended" | "postal-address-extended-postal-code" | "postal-address-locality" | "postal-address-region" | "postal-code" | "street-address" | "sms-otp" | "tel" | "tel-country-code" | "tel-national" | "tel-device" | "url" | "username" | "username-new" | "off" | undefined | undefined;
    autoCorrect?: boolean | undefined | undefined;
    autoFocus?: boolean | undefined | undefined;
    blurOnSubmit?: boolean | undefined | undefined;
    submitBehavior?: import("react-native").SubmitBehavior | undefined;
    caretHidden?: boolean | undefined | undefined;
    contextMenuHidden?: boolean | undefined | undefined;
    defaultValue?: string | undefined | undefined;
    editable?: boolean | undefined | undefined;
    keyboardType?: import("react-native").KeyboardTypeOptions | undefined;
    inputMode?: import("react-native").InputModeOptions | undefined;
    maxLength?: number | undefined | undefined;
    multiline?: boolean | undefined | undefined;
    onChange?: ((e: import("react-native").TextInputChangeEvent) => void) | undefined | undefined;
    onChangeText?: ((text: string) => void) | undefined | undefined;
    onContentSizeChange?: ((e: import("react-native").TextInputContentSizeChangeEvent) => void) | undefined | undefined;
    onEndEditing?: ((e: import("react-native").TextInputEndEditingEvent) => void) | undefined | undefined;
    onSelectionChange?: ((e: import("react-native").TextInputSelectionChangeEvent) => void) | undefined | undefined;
    onSubmitEditing?: ((e: import("react-native").TextInputSubmitEditingEvent) => void) | undefined | undefined;
    onScroll?: ((e: import("react-native").TextInputScrollEvent) => void) | undefined | undefined;
    onKeyPress?: ((e: import("react-native").TextInputKeyPressEvent) => void) | undefined | undefined;
    placeholderTextColor?: import("react-native").ColorValue | undefined;
    readOnly?: boolean | undefined | undefined;
    returnKeyType?: import("react-native").ReturnKeyTypeOptions | undefined;
    enterKeyHint?: import("react-native").EnterKeyHintTypeOptions | undefined;
    secureTextEntry?: boolean | undefined | undefined;
    selectTextOnFocus?: boolean | undefined | undefined;
    selection?: {
        start: number;
        end?: number | undefined;
    } | undefined | undefined;
    selectionColor?: import("react-native").ColorValue | undefined;
    inputAccessoryViewID?: string | undefined | undefined;
    inputAccessoryViewButtonLabel?: string | undefined | undefined;
    maxFontSizeMultiplier?: number | null | undefined | undefined;
    disableKeyboardShortcuts?: boolean | undefined | undefined;
    clearButtonMode?: "never" | "while-editing" | "unless-editing" | "always" | undefined | undefined;
    clearTextOnFocus?: boolean | undefined | undefined;
    dataDetectorTypes?: import("react-native").DataDetectorTypes | import("react-native").DataDetectorTypes[] | undefined;
    enablesReturnKeyAutomatically?: boolean | undefined | undefined;
    keyboardAppearance?: "default" | "light" | "dark" | undefined | undefined;
    passwordRules?: string | null | undefined | undefined;
    rejectResponderTermination?: boolean | null | undefined | undefined;
    selectionState?: import("react-native").DocumentSelectionState | undefined;
    spellCheck?: boolean | undefined | undefined;
    textContentType?: "none" | "URL" | "addressCity" | "addressCityAndState" | "addressState" | "countryName" | "creditCardNumber" | "creditCardExpiration" | "creditCardExpirationMonth" | "creditCardExpirationYear" | "creditCardSecurityCode" | "creditCardType" | "creditCardName" | "creditCardGivenName" | "creditCardMiddleName" | "creditCardFamilyName" | "emailAddress" | "familyName" | "fullStreetAddress" | "givenName" | "jobTitle" | "location" | "middleName" | "name" | "namePrefix" | "nameSuffix" | "nickname" | "organizationName" | "postalCode" | "streetAddressLine1" | "streetAddressLine2" | "sublocality" | "telephoneNumber" | "username" | "password" | "newPassword" | "oneTimeCode" | "birthdate" | "birthdateDay" | "birthdateMonth" | "birthdateYear" | "cellularEID" | "cellularIMEI" | "dateTime" | "flightNumber" | "shipmentTrackingNumber" | undefined | undefined;
    scrollEnabled?: boolean | undefined | undefined;
    lineBreakStrategyIOS?: "none" | "standard" | "hangul-word" | "push-out" | undefined | undefined;
    lineBreakModeIOS?: "wordWrapping" | "char" | "clip" | "head" | "middle" | "tail" | undefined | undefined;
    smartInsertDelete?: boolean | undefined | undefined;
    cursorColor?: import("react-native").ColorValue | null | undefined;
    selectionHandleColor?: import("react-native").ColorValue | null | undefined;
    importantForAutofill?: "auto" | "no" | "noExcludeDescendants" | "yes" | "yesExcludeDescendants" | undefined | undefined;
    disableFullscreenUI?: boolean | undefined | undefined;
    inlineImageLeft?: string | undefined | undefined;
    inlineImagePadding?: number | undefined | undefined;
    numberOfLines?: number | undefined | undefined;
    returnKeyLabel?: string | undefined | undefined;
    textBreakStrategy?: "simple" | "highQuality" | "balanced" | undefined | undefined;
    underlineColorAndroid?: import("react-native").ColorValue | undefined;
    textAlignVertical?: "auto" | "top" | "bottom" | "center" | undefined | undefined;
    showSoftInputOnFocus?: boolean | undefined | undefined;
    verticalAlign?: "auto" | "top" | "bottom" | "middle" | undefined | undefined;
    style?: import("react-native").StyleProp<import("react-native").TextStyle> | ((state: {
        focused: boolean;
        disabled: boolean;
    }) => RNTextInputProps["style"]);
    disabled?: boolean | undefined;
} & import("react").RefAttributes<RNTextInput>>;
