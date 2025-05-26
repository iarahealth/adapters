import { BaselineAlignment } from '@syncfusion/ej2-documenteditor';
import { CharacterFormatProperties } from '@syncfusion/ej2-documenteditor';
import { default as default_2 } from '@syncfusion/ej2-locale/src/es.json';
import { default as default_3 } from '@syncfusion/ej2-locale/src/pt-BR.json';
import { Dialog } from '@syncfusion/ej2-popups';
import { DocumentEditor } from '@syncfusion/ej2-documenteditor';
import { DocumentEditorContainer } from '@syncfusion/ej2-documenteditor';
import { DocumentEditorKeyDownEventArgs } from '@syncfusion/ej2-documenteditor';
import { Editor } from 'tinymce';
import { HighlightColor } from '@syncfusion/ej2-documenteditor';
import { ListView } from '@syncfusion/ej2-lists';
import { Ribbon as Ribbon_2 } from '@syncfusion/ej2-ribbon';
import { RibbonTabModel } from '@syncfusion/ej2-ribbon';
import { Strikethrough } from '@syncfusion/ej2-documenteditor';
import { Underline } from '@syncfusion/ej2-documenteditor';

export declare interface ALSAudioInputOutput {
    communication?: boolean;
    default?: boolean;
    id: number | string;
    name: string;
    selected: boolean;
}

export declare interface AlsCheckerProps {
    state: StateTypes;
    timeLastALSMessage: number;
    timeLastALSPing: number;
    timeLastInitALSConnectors: number;
    timeStateStarted: number;
}

export declare interface ALSIaraInitObject {
    key: string;
    parameters: IaraAPISpeechCurrent;
    user: IaraAPIUser;
    asr: IaraAPIAsr;
}

export declare type CommandCallback = (resultEventDetail: IaraSpeechRecognitionDetail, entryText: string, callbackParams: unknown[], groups?: string[]) => void;

export declare interface Config {
    emitHookBeforeSend?: boolean;
    processInitStep?: boolean;
    processOngoingMessages?: boolean;
}

export declare interface Config {
    enclosedCommandContext: {
        enclosedKey: string;
        isEnclosed: boolean;
        isEnclosedStart: boolean;
    };
    enclosedPriority?: number;
    replaceFunction?: () => void;
    replaceValue: string;
    resultFunction?: () => void;
    richTranscript: boolean;
    searchRichTranscript: boolean;
    transcript: boolean;
    [key: string]: unknown | unknown[];
}

declare enum ContentType {
    JSON = 0,
    FORM_URLENCODED = 1
}

export declare interface DefaultValue<T> {
    defaultValue: T;
    externalAccessVia?: keyof InitParams;
    internalAccessVia?: keyof InitParams;
    required: boolean;
}

export declare abstract class EditorAdapter {
    protected _recognition: IaraSpeechRecognition;
    config: IaraEditorConfig;
    onIaraCommand?: (command: string) => void;
    protected _locale: Record<string, string>;
    protected abstract _styleManager: IaraEditorStyleManager;
    protected abstract _navigationFieldManager: IaraEditorNavigationFieldManager;
    protected static DefaultConfig: IaraEditorConfig;
    protected _inferenceFormatter: IaraEditorInferenceFormatter;
    protected _currentLanguage: {
        [k: string]: any;
    };
    protected _defaultCommandArgs: [undefined, undefined, Config | Config[]];
    private readonly _speechListeners;
    constructor(_recognition: IaraSpeechRecognition, config?: IaraEditorConfig);
    protected abstract _handleRemovedNavigationField(): void;
    abstract blockEditorWhileSpeaking(status: boolean): void;
    abstract clearReport(): void;
    abstract copyReport(): Promise<string[]>;
    abstract insertInference(inference: IaraSpeechRecognitionDetail): void;
    abstract getEditorContent(): Promise<[string, string, string, string?]>;
    abstract print(): void;
    beginReport(): Promise<string | void>;
    finishReport(metadata?: Record<string, unknown>): Promise<string[]>;
    hasEmptyRequiredFields(): boolean;
    navigationManagerFields(): IaraEditorNavigationFieldManager;
    protected _initCommands(): void;
    private _initListeners;
    protected _onEditorDestroyed(): Promise<void>;
    protected _onIaraCommand(command: string): void;
    protected _updateReport(plainContent: string, richContent: string): Promise<string>;
    protected _beginReport(): Promise<void>;
}

export declare interface EventDevice {
    id: string;
    name: string;
    group: string;
    selected: boolean;
}

declare interface Font {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
}

export declare interface GenericXMLParams {
    headers?: {
        [key: string]: string;
    };
    method?: string;
    responseType?: XMLHttpRequestResponseType;
}

export declare const IARA_DEBUG: () => void;

declare interface IaraAdditiveBookmark {
    title: string;
    delimiterStart: string;
    delimiterEnd: string;
    additiveTexts: {
        identifier: string;
        phrase: string;
    }[];
}

declare class IaraALSChecker<T> {
    private _iaraContext;
    private _LOG_PREFIX;
    private _state;
    private _stateFunctions;
    private _timeLastALSMessage;
    private _timeLastALSPing;
    private _timeLastInitALSConnectors;
    private _timeStateStarted;
    constructor(_iaraContext: IaraSpeechRecognitionContext<T>);
    private _init;
    /**
     * Runs a complete check to evaluate if the ALS is installed, up and running.
     */
    run(): void;
    props(): AlsCheckerProps;
    private _setState;
    private _stateChecking;
    private _startInstallALSProcedures;
    private _stateWaitingResume;
    private _stateInitWaitingInstall;
    private _stateALSUp;
    private _tick;
    private _pingALS;
    private _processStatesLogic;
    private _handleALSBackOnline;
    processHook(event: CustomEvent<IaraInternalDetail<string, T>>, data: any): void;
    private _emitALSEvent;
    private _secondsSinceLastALSMessage;
    private _secondsSinceStateStarted;
    private _secondsSince;
    private _milliSince;
    private _signalALSActivity;
}

export declare interface IaraAPIAsr {
    id: number;
    major_version: number;
    tag: string;
    urls: {
        macos: string;
        windows: string;
    };
    version: string;
}

declare class IaraAPIConnector<T, D> extends IaraHTTPConnector<T, D, IaraAPIXMLParams> {
    /**
     * A reference to the Iara namespace.
     * @ignore
     */
    protected _iaraContext: IaraSpeechRecognitionContext<T>;
    /**
     * URL that this connector will make requests to.
     *
     * @ignore
     */
    protected _urlSuffix: string;
    /**
     * Object formatted as `{headerName: "headerContent"}` that will be used to
     * add headers to all requests made by this connector.
     *
     * @ignore
     */
    protected _baseHeaders: {
        [key: string]: string;
    };
    protected _BASE_CONNECTOR_URL: any;
    protected _CONTENT_TYPE: ContentType;
    private _regionUrlMap;
    constructor(
    /**
     * A reference to the Iara namespace.
     * @ignore
     */
    _iaraContext: IaraSpeechRecognitionContext<T>, 
    /**
     * URL that this connector will make requests to.
     *
     * @ignore
     */
    _urlSuffix: string, 
    /**
     * Object formatted as `{headerName: "headerContent"}` that will be used to
     * add headers to all requests made by this connector.
     *
     * @ignore
     */
    _baseHeaders: {
        [key: string]: string;
    });
}

export declare interface IaraAPIFeedback {
    feedback: string;
    mood: string;
    pk: number;
    subject: string;
}

export declare interface IaraAPILogin {
    key: string;
}

export declare interface IaraAPIParserRule {
    created_by: number;
    direction: string;
    group: number;
    id: number;
    is_regex: boolean;
    priority: number;
    source: string;
    target: string;
    type: string;
    user: number;
}

export declare interface IaraAPIParserRules {
    group_parser_rules: {
        [direction in ParserRuleDirection]: IaraAPIParserRule[];
    }[];
    parser_rules: {
        [direction in ParserRuleDirection]: IaraAPIParserRule[];
    }[];
    user_parser_rules: {
        [direction in ParserRuleDirection]: IaraAPIParserRule[];
    }[];
}

declare enum IaraAPIRegions {
    EUROPE = "europe",
    SOUTH_AMERICA = "south-america"
}

export declare interface IaraAPIReport {
    context: string;
    date: string;
    language: string;
    richText: string;
    text: string;
    userId: number;
}

export declare interface IaraAPISDKVersions {
    als_version: {
        major_version: number;
        tag: string;
        urls: {
            macos: string;
            windows: string;
        };
        version: string;
    };
    api_version: string;
    asr_version: {
        major_version: number;
        tag: string;
        urls: {
            macos: string;
            windows: string;
        };
        version: string;
    };
    id: number;
    sdk_version: string;
}

export declare interface IaraAPISpeechCurrent {
    id: number;
    acoustic_model: {
        id: number;
        file: SpeechFile;
        key: string;
        num_audios: number;
        num_hours: number;
        num_speakers: number;
        updated_at: string;
        wer: number;
    };
    language_model: {
        id: number;
        alphabet_file: SpeechFile;
        file: SpeechFile;
        translations_file: SpeechFile;
    };
    active: boolean;
    beam_width: number;
    default: boolean;
    lm_alpha: number;
    lm_beta: number;
    num_context: number;
    num_features: number;
    user: number;
}

export declare interface IaraAPIUser {
    email: string;
    first_name: string;
    last_name: string;
    pk: number;
    username: string;
}

export declare interface IaraAPIXMLParams extends GenericXMLParams {
    context?: string;
    date?: string;
    env?: string;
    items?: string;
    email?: string;
    feedback?: string;
    language?: string;
    license_key?: string;
    mood?: string;
    richText?: string;
    sdkVersion?: string;
    subject?: string;
    text?: string;
    userId?: number;
}

declare class IaraASRManager<T> {
    private _iaraContext;
    private _ASRParserRules;
    private _LOG_PREFIX;
    getParamsResponse: ALSIaraInitObject;
    waitingReplyGetParams: boolean;
    constructor(_iaraContext: IaraSpeechRecognitionContext<T>);
    processHook(event: CustomEvent<IaraInternalDetail<string, T>>, data: any): void;
    processEndpointMessage(endpoint: WebSocket, message: IaraASRMessage): void;
    _handleOnIaraMessageFromASRmessage(message: string): void;
    private _onResponseTaskGetParams;
    private _onResponseTaskInferenceFromFile;
    private _onResponseTaskUpdateTranslations;
    taskGetParams(): void;
    private _sendIaraMessage;
    updateTranslations(): void;
}

export declare interface IaraASRMessage {
    asrLoaded?: {
        userId: number;
        acousticModelId: number;
    };
    iaraMessage?: string;
    sdkLoaded?: {
        userId: number;
        acousticModelId: number;
    };
}

declare class IaraAudioDeviceDetail extends IaraEventDetail {
    type: IaraEvent;
    /**
     * Informações sobre o dispositivo de audio
     */
    data: EventDevice | string;
    constructor(type: IaraEvent, 
    /**
     * Informações sobre o dispositivo de audio
     */
    data: EventDevice | string);
    toString(): string;
}

declare class IaraAudioLevelUpdateDetail extends IaraEventDetail {
    /**
     * Um inteiro que descreve o nível do dispositivo de audio.
     */
    data: number;
    constructor(
    /**
     * Um inteiro que descreve o nível do dispositivo de audio.
     */
    data: number);
    toString(): string;
}

declare class IaraAutomation<T> {
    private _iaraContext;
    private _diacriticsMap;
    private _LOG_PREFIX;
    constructor(_iaraContext: IaraSpeechRecognitionContext<T>);
    processEndpointMessage(endpoint: WebSocket, message: IaraRobotMessage): void;
    processHook(event: CustomEvent<IaraInternalDetail<string, T>>, data: any): void;
    setRobotDelay(): void;
    private _handleRobotMessage;
    private _getRobot;
    private _getCtrlKey;
    paste(): void;
    pasteText(text: string, html: string): void;
    copy(): void;
    copyText(text: string, html: string, rtf: string): void;
    private _setClipboard;
    private _stringToASCIIKeyEvent;
    executeRobotCommand(strokes: (string | number)[][]): void;
    getRobotCommandForEllipsis(): (string | number)[][];
    private _normalizeString;
    stringToKeyboardEvent(character: string): (string | number)[][];
}

declare class IaraCommands<T> {
    private _iaraContext;
    private _internal;
    private _predefinedCommands;
    constructor(_iaraContext: IaraSpeechRecognitionContext<T>);
    private _configFnReplaceCommand;
    private _configFnResultFilter;
    init(): void;
    private _addPredefinedCommands;
    private _onSpeechRecognitionStop;
    private _resetTranscriptAnalysisPoiters;
    /**
     * callback: fn(resultEvent.detail, entry.text, entry.callbackParam)
     */
    add(text: string | string[], callback: CommandCallback | CommandCallback[], callbackThis?: IaraCommands<T>, callbackParam?: unknown[] | {
        firstCallbackArgs: unknown[];
        secondCallbackArgs: unknown[];
    }, config?: Config | Config[]): boolean;
    private _addSimpleCmd;
    private _addEnclosedCmd;
    private _addCmd;
    private _isStringOrRegexValid;
    private _isCallbackValid;
    private _exists;
    private _find;
    /**
     * @ignore
     */
    remove(text: any, callback: any): number;
    /**
     * newText (optional): replace the found command's text property with newText
     * newCallback (optional): replace the found command's callback property with newCallback
     */
    change(text: string, callback: any, newText: string, newCallback: any): boolean;
    /**
     *
     * @ignore
     */
    private _setupTranscriptAnalysis;
    private _processLogic;
    /**
     * @ignore
     */
    process(resultEvent: CustomEvent<IaraSpeechRecognitionDetail>): void;
    private _getComposedCommand;
    private _updateResultEventUsingCommandEntry;
}

declare class IaraDataAPIConnector<T, D, P> extends IaraHTTPConnector<T, D, P> {
    protected _iaraContext: IaraSpeechRecognitionContext<T>;
    protected _urlSuffix: string;
    protected _baseHeaders: {
        [key: string]: string;
    };
    protected _contentType?: ContentType;
    private _regionUrlMap;
    protected _BASE_CONNECTOR_URL: string;
    protected _CONTENT_TYPE: ContentType;
    constructor(_iaraContext: IaraSpeechRecognitionContext<T>, _urlSuffix: string, _baseHeaders: {
        [key: string]: string;
    }, _contentType?: ContentType);
}

export declare interface IaraDataAPIValidations {
    status: string;
}

export declare interface IaraDataAPIXMLParams extends GenericXMLParams {
    study_uid: string;
    report_text: string;
}

declare class IaraDeviceManager<T> {
    /**
     * Reference to the Iara namespace.
     *
     * @ignore
     */
    private _iaraContext;
    private _shortcuts;
    private _speechMike;
    constructor(
    /**
     * Reference to the Iara namespace.
     *
     * @ignore
     */
    _iaraContext: IaraSpeechRecognitionContext<T>, _shortcuts: IaraShortcuts<T>);
    processHook(event: any, data: any): void;
    isSpeechMikeAvailable(): boolean;
    private _adjustSpeechMikeLEDsFromHook;
    /**
     * Sets the LEDs indicators of any SpeechMike plugged-in into the machine.
     * If the function parameter is not specified, all LED indicators at turned off. Any LEDs
     * button not mentioned in the `buttons` param will be set to OFF.
     *
     * Available buttons: 'topGreen', 'topRed', 'eolGreen', 'eolRed', 'insertGreen', 'insertRed', 'f1', 'f2', 'f3', 'f4'.
     * Available values: 'OFF', 'SLOW', 'FAST', 'SOLID'.
     *
     * @param {object} buttons Dictionary with `key:value`, where `key` is the name of a button and `value` its behavior. E.g. `topGreen:'SLOW'`.
     */
    setSpeechMikeLEDs(buttons: SpeechMikeButton): void;
    processEndpointMessage(endpoint: WebSocket, message: KeyboardMessage | SpeechMikeMessage): void;
    private _emitKeyboardEventsAndHooks;
    private _speechMikeIsLifeCycleMessage;
    private _issueInternalHook;
    private _handleSpeechMikeLifeCycleMessage;
    private _handleSpeechMikeMessage;
    private _handleKeyboardMessage;
}

export declare interface IaraEditorConfig {
    darkMode: boolean;
    enableSpeechRecognition: boolean;
    font?: {
        availableFamilies: string[];
        availableSizes: number[];
        family: string;
        size: number;
    };
    saveReport: boolean;
    lineSpacing?: number;
    paragraphSpacing?: {
        after: number;
        before: number;
    };
    language: "pt-BR" | "es";
    zoomFactor: string;
    highlightInference: boolean;
    ribbon?: Ribbon;
    mouseButton: boolean;
}

declare class IaraEditorInferenceFormatter {
    _addTrailingSpaces(text: string, wordAfter: string, wordBefore: string, isAtStartOfLine: boolean): string;
    _capitalize(text: string, wordBefore: string): string;
    protected _estimateVolume(text: string, regex: string): string;
    protected _parseMeasurements(text: string): string;
    format(inference: IaraSpeechRecognitionDetail, wordBefore: string, wordAfter: string, isAtStartOfLine: boolean): string;
}

declare abstract class IaraEditorNavigationFieldManager {
    private readonly _recognition;
    abstract nextField(): void;
    abstract previousField(): void;
    abstract goToField(title: string): void;
    abstract hasEmptyRequiredFields(): boolean;
    abstract insertField(content?: string, title?: string, type?: "Field" | "Mandatory" | "Optional"): void;
    abstract additiveBookmark: IaraAdditiveBookmark;
    private readonly _recognitionListeners;
    constructor(_recognition: IaraSpeechRecognition);
    private _initListeners;
    destroy(): void;
}

declare abstract class IaraEditorStyleManager {
    abstract toggleBold(): void;
    abstract toggleItalic(): void;
    abstract toggleList(): void;
    abstract toggleNumberedList(): void;
    abstract toggleUnderline(): void;
    abstract toggleUppercase(): void;
    abstract setSelectionFontFamily(fontName: string): void;
    abstract setSelectionFontSize(fontSize: number): void;
    abstract setSelectionParagraphSpacingFormat(paragraphSpacing: {
        after: number;
        before: number;
    }): void;
    abstract setEditorFontColor(fontColor: string): void;
}

export declare interface IaraEngineSettings {
    stt: {
        sampleRate: number;
    };
    service: {
        fallbackUrl?: string;
        port: number;
        type: string;
        url: string;
    };
}

declare enum IaraEngineTypes {
    ALS = "ALS",
    IARA_DESKTOP = "Iara Desktop"
}

declare class IaraEnvDetector {
    private _internal;
    alsVersion: string;
    arch: string;
    browser: IBrowserOrOS;
    incompatible: boolean;
    os: IBrowserOrOS;
    useBrowserRecorder: boolean;
    constructor();
    summary(): string;
    isMac(): boolean;
    isWindows(): boolean;
    private _getUserAgent;
    private _checkMacEnv;
    private _checkWindowsEnv;
    private _init;
    props(): Record<string, unknown>;
}

/**
 * Descreve um evento da Iara. Eventos podem ser ouvidos através do método `addEventListener()` do
 * reconhecedor da Iara, conforme o exemplo:
 *
 * ```js
 * var recognition = new IaraSpeechRecognition();
 *
 * recognition.addEventListener(IaraEvent.INIT_DONE, function(e) {
 *     console.log(e);
 * });
 *
 * recognition.init(...);
 *
 * ```
 *
 * O reconhecedor emite diversos eventos relacionados ao seu funcionando, desde passos de inicialização
 * até reconhecimento de voz.
 *
 * @see IaraSpeechRecognition#init
 * @see IaraEventDetail
 * @class
 */
export declare enum IaraEvent {
    /**
     * Disparado quando o reconhecedor termina de fazer um reconhecimento de voz
     * e o disponibiliza para uso.
     *
     * @see IaraSpeechRecognition#start
     * @see IaraSpeechRecognition#stop
     * @see IaraSpeechRecognition#testAudioInputOutput
     * @alias IaraEvent.SPEECH_RECOGNITION_RESULT
     */
    SPEECH_RECOGNITION_RESULT = "iaraSpeechRecognitionResult",
    /**
     * Disparado quando o reconhecedor passa a reconhecer o fluxo de audio, _após_ o intervalo de _warm up_.
     * O tempo de _warm up_ é o delay entre a invocação do método `start()` e o início, de fato, do reconhecimento.
     * Depois que o método `start()` do reconhecedor é invocado, o reconhecedor leva alguns milisegundos,
     * que é um tempo variável dependente da máquina, para iniciar o processamento. Esse período entre a
     * invocação do `start()` e o início do reconhecimento é o tempo de _warm up_.
     *
     *
     * @see IaraEvent.SPEECH_RECOGNITION_STARTING
     * @see IaraEvent.SPEECH_RECOGNITION_STOP
     * @see IaraEvent.SPEECH_RECOGNITION_RESULT
     * @see IaraSpeechRecognition#start
     * @see IaraSpeechRecognition#stop
     * @see IaraSpeechRecognition#testAudioInputOutput
     *
     * @alias IaraEvent.SPEECH_RECOGNITION_START
     */
    SPEECH_RECOGNITION_START = "iaraSpeechRecognitionStart",
    /**
     * @see IaraEvent.SPEECH_RECOGNITION_START
     * @see IaraEvent.SPEECH_RECOGNITION_STOP
     * @see IaraEvent.SPEECH_RECOGNITION_RESULT
     * @see IaraSpeechRecognition#start
     * @see IaraSpeechRecognition#stop
     * @see IaraSpeechRecognition#testAudioInputOutput
     *
     * @alias IaraEvent.SPEECH_RECOGNITION_STARTING
     */
    SPEECH_RECOGNITION_STARTING = "iaraSpeechRecognitionStarting",
    /**
     * @see IaraEvent.SPEECH_RECOGNITION_START
     * @see IaraEvent.SPEECH_RECOGNITION_STARTING
     * @see IaraEvent.SPEECH_RECOGNITION_RESULT
     * @see IaraSpeechRecognition#start
     * @see IaraSpeechRecognition#stop
     * @see IaraSpeechRecognition#testAudioInputOutput
     *
     * @alias IaraEvent.SPEECH_RECOGNITION_STOP
     */
    SPEECH_RECOGNITION_STOP = "iaraSpeechRecognitionStop",
    /**
     * @see IaraEvent.INIT_DONE
     * @see IaraEvent.INIT_PROGRESS
     * @see IaraSpeechRecognition#init
     *
     * @alias IaraEvent.SPEECH_RECOGNITION_READY
     */
    SPEECH_RECOGNITION_READY = "iaraSpeechRecognitionReady",
    /**
     * Disparado quando o VAD (voice activity detection) detecta atividade de voz.
     *
     * @alias IaraEvent.SPEECH_RECOGNITION_VAD_VOICE_START
     */
    SPEECH_RECOGNITION_VAD_VOICE_START = "iaraSpeechRecognitionVADVoiceStart",
    /**
     * Disparado quando o VAD (voice activity detection) detecta atividade de voz.
     *
     * @alias IaraEvent.SPEECH_RECOGNITION_VAD_VOICE_STOP
     */
    SPEECH_RECOGNITION_VAD_VOICE_STOP = "iaraSpeechRecognitionVADVoiceStop",
    /**
     * Info
     *
     * @alias IaraEvent.INIT_DONE
     */
    INIT_DONE = "iaraInitDone",
    /**
     * Info
     *
     * @alias IaraEvent.INIT_FAIL
     */
    INIT_FAIL = "iaraInitFail",
    /**
     * O ALS está carregando o modelo de voz do usuário para a memória para uso no reconhecimento.
     * Pode acontecer do modelo ser muito antigo, ou de alguma forma não utilizável, então o ALS
     * fará download the um modelo novo. Se isso ocorrer, os eventos definidos em
     * `IaraEvent.INIT_VOICE_MODEL_DOWNLOAD_*` serão disparados. Caso contrário (nenhum modelo precia
     * ser baixado e tudo está pronto para uso), os eventos de download não serão disparados.
     *
     * @see IaraEvent.SPEECH_RECOGNITION_READY
     * @see IaraEvent.INIT_VOICE_MODEL_DOWNLOAD_STARTED
     * @see IaraEvent.INIT_VOICE_MODEL_DOWNLOAD_COMPLETED
     * @see IaraEvent.INIT_VOICE_MODEL_DOWNLOAD_PROGRESS
     * @see IaraSpeechRecognition#init
     *
     * @alias IaraEvent.INIT_VOICE_MODEL_LOAD
     */
    INIT_VOICE_MODEL_LOAD = "iaraInitVoiceModelLoad",
    /**
     * Um modelo de voz foi carregado para a memória e está sendo preparado para uso.
     *
     * @see IaraEvent.SPEECH_RECOGNITION_READY
     * @see IaraEvent.INIT_VOICE_MODEL_DOWNLOAD_STARTED
     * @see IaraEvent.INIT_VOICE_MODEL_DOWNLOAD_COMPLETED
     * @see IaraEvent.INIT_VOICE_MODEL_DOWNLOAD_PROGRESS
     * @see IaraSpeechRecognition#init
     *
     * @alias IaraEvent.INIT_VOICE_MODEL_SETUP
     */
    INIT_VOICE_MODEL_SETUP = "iaraInitVoiceModelSetup",
    /**
     * Info
     *
     * @alias IaraEvent.INIT_VOICE_MODEL_DOWNLOAD_STARTED
     */
    INIT_VOICE_MODEL_DOWNLOAD_STARTED = "iaraInitVoiceModelDownloadStarted",
    /**
     * Info
     *
     * @alias IaraEvent.INIT_VOICE_MODEL_DOWNLOAD_COMPLETED
     */
    INIT_VOICE_MODEL_DOWNLOAD_COMPLETED = "iaraInitVoiceModelDownloadCompleted",
    /**
     * Info
     *
     * @alias IaraEvent.INIT_VOICE_MODEL_DOWNLOAD_PROGRESS
     */
    INIT_VOICE_MODEL_DOWNLOAD_PROGRESS = "iaraInitVoiceModelDownloadProgress",
    /**
     * Info
     *
     * @alias IaraEvent.INIT_SPEECH_RECOGNITION_ENGINE_DOWNLOAD_STARTED
     */
    INIT_SPEECH_RECOGNITION_ENGINE_DOWNLOAD_STARTED = "iaraInitSpeechRecognitionEngineDownloadStarted",
    /**
     * Info
     *
     * @alias IaraEvent.INIT_SPEECH_RECOGNITION_ENGINE_DOWNLOAD_COMPLETED
     */
    INIT_SPEECH_RECOGNITION_ENGINE_DOWNLOAD_COMPLETED = "iaraInitSpeechRecognitionEngineDownloadCompleted",
    /**
     * Info
     *
     * @alias IaraEvent.INIT_SPEECH_RECOGNITION_ENGINE_DOWNLOAD_PROGRESS
     */
    INIT_SPEECH_RECOGNITION_ENGINE_DOWNLOAD_PROGRESS = "iaraInitSpeechRecognitionEngineDownloadProgress",
    /**
     * Info
     *
     * @alias IaraEvent.INIT_API_AUTH
     */
    INIT_API_AUTH = "iaraInitAPIAuth",
    /**
     * Info
     *
     * @alias IaraEvent.INIT_API_CONFIG
     */
    INIT_API_CONFIG = "iaraInitAPIConfig",
    /**
     * Info
     *
     * @alias IaraEvent.INIT_ALS_CHECK
     */
    INIT_ALS_CHECK = "iaraInitALSCheck",
    /**
     * Info
     *
     * @alias IaraEvent.INIT_INSTALL_ALS
     */
    INIT_INSTALL_ALS = "iaraInitInstallALS",
    /**
     * Info
     *
     * @see IaraEvent.INIT_DONE
     * @see IaraEvent.INIT_FAIL
     * @see IaraEvent.SPEECH_RECOGNITION_READY
     *
     * @alias IaraEvent.INIT_PROGRESS
     */
    INIT_PROGRESS = "iaraInitProgress",
    /**
     * Info
     *
     * @see IaraEvent.NEWER_ALS_AVAILABLE
     * @see IaraEvent.ALS_ONLINE
     * @see IaraEvent.INIT_ALS_CHECK
     *
     * @alias IaraEvent.ALS_OFFLINE
     */
    ALS_OFFLINE = "iaraALSOffline",
    /**
     * Info
     *
     * @see IaraEvent.NEWER_ALS_AVAILABLE
     * @see IaraEvent.ALS_OFFLINE
     * @see IaraEvent.INIT_ALS_CHECK
     *
     * @alias IaraEvent.ALS_ONLINE
     */
    ALS_ONLINE = "iaraALSOnline",
    /**
     * Info
     *
     * @see IaraEvent.SPEECH_RECOGNITION_START
     * @see IaraEvent.SPEECH_RECOGNITION_STARTING
     * @see IaraEvent.SPEECH_RECOGNITION_STOP
     * @see IaraEvent.SPEECH_RECOGNITION_RESULT
     *
     * @alias IaraEvent.AUDIO_LEVEL_UPDATE
     */
    AUDIO_LEVEL_UPDATE = "iaraAudioLevelUpdate",
    /**
     * Info
     *
     * @see IaraEvent.AUDIO_DEVICE_REMOVE
     * @see IaraEvent.AUDIO_DEVICE_CHANGE
     * @see IaraSpeechRecognition#testAudioInputOutput
     *
     * @alias IaraEvent.AUDIO_DEVICE_ADD
     */
    AUDIO_DEVICE_ADD = "iaraAudioDeviceAdd",
    /**
     * Info
     *
     * @see IaraEvent.AUDIO_DEVICE_ADD
     * @see IaraEvent.AUDIO_DEVICE_CHANGE
     * @see IaraSpeechRecognition#testAudioInputOutput
     *
     * @alias IaraEvent.AUDIO_DEVICE_REMOVE
     */
    AUDIO_DEVICE_REMOVE = "iaraAudioDeviceRemove",
    /**
     * Info
     *
     * @see IaraEvent.AUDIO_DEVICE_ADD
     * @see IaraEvent.AUDIO_DEVICE_REMOVE
     *
     * @alias IaraEvent.AUDIO_DEVICE_CHANGE
     */
    AUDIO_DEVICE_CHANGE = "iaraAudioDeviceChange",
    /**
     * Info
     *
     * @alias IaraEvent.SHORTCUT
     */
    SHORTCUT = "iaraShortcut",
    /**
     * Info
     *
     * @alias IaraEvent.SPEECHMIKEBUTTON
     */
    SPEECHMIKE_BUTTON = "iaraSpeechMikeButton",
    /**
     * Info
     *
     * @alias IaraEvent.EOLBUTTONDOWN
     */
    SPEECHMIKE_EOL_BUTTON_DOWN = "iaraSpeechMikeEolButtonDown",
    /**
     * Info
     *
     * @alias IaraEvent.EOLBUTTONPRESS
     */
    SPEECHMIKE_EOL_BUTTON_PRESS = "iaraSpeechMikeEolButtonPress",
    /**
     * Info
     *
     * @alias IaraEvent.EOLBUTTONUP
     */
    SPEECHMIKE_EOL_BUTTON_UP = "iaraSpeechMikeEolButtonUp",
    /**
     * Info
     *
     * @alias IaraEvent.FORWARDBUTTONDOWN
     */
    SPEECHMIKE_FORWARD_BUTTON_DOWN = "iaraSpeechMikeForwardButtonDown",
    /**
     * Info
     *
     * @alias IaraEvent.FORWARDBUTTONPRESS
     */
    SPEECHMIKE_FORWARD_BUTTON_PRESS = "iaraSpeechMikeForwardButtonPress",
    /**
     * Info
     *
     * @alias IaraEvent.FORWARDBUTTONUP
     */
    SPEECHMIKE_FORWARD_BUTTON_UP = "iaraSpeechMikeForwardButtonUp",
    /**
     * Info
     *
     * @alias IaraEvent.INSERTBUTTONDOWN
     */
    SPEECHMIKE_INS_BUTTON_DOWN = "iaraSpeechMikeInsButtonDown",
    /**
     * Info
     *
     * @alias IaraEvent.INSERTBUTTONPRESS
     */
    SPEECHMIKE_INS_BUTTON_PRESS = "iaraSpeechMikeInsButtonPress",
    /**
     * Info
     *
     * @alias IaraEvent.INSERTBUTTONUP
     */
    SPEECHMIKE_INS_BUTTON_UP = "iaraSpeechMikeInsButtonUp",
    /**
     * Info
     *
     * @alias IaraEvent.RECORDBUTTONUP
     */
    SPEECHMIKE_RECORD_BUTTON_UP = "iaraSpeechMikeRecordButtonUp",
    /**
     * Info
     *
     * @alias IaraEvent.RECORDBUTTONDOWN
     */
    SPEECHMIKE_RECORD_BUTTON_DOWN = "iaraSpeechMikeRecordButtonDown",
    /**
     * Info
     *
     * @alias IaraEvent.RECORDBUTTONPRESS
     */
    SPEECHMIKE_RECORD_BUTTON_PRESS = "iaraSpeechMikeRecordButtonPress",
    /**
     * Info
     *
     * @alias IaraEvent.REWINDBUTTONDOWN
     */
    SPEECHMIKE_REWIND_BUTTON_DOWN = "iaraSpeechMikeRewindButtonDown",
    /**
     * Info
     *
     * @alias IaraEvent.REWINDBUTTONPRESS
     */
    SPEECHMIKE_REWIND_BUTTON_PRESS = "iaraSpeechMikeRewindButtonPress",
    /**
     * Info
     *
     * @alias IaraEvent.REWINDBUTTONUP
     */
    SPEECHMIKE_REWIND_BUTTON_UP = "iaraSpeechMikeRewindButtonUp",
    /**
     * Info
     *
     * @alias IaraEvent.INTERNAL
     */
    INTERNAL = "iaraInternal",
    /**
     * Info
     *
     * @see IaraEvent.ERROR_NO_INPUT_DEVICE
     * @see IaraEvent.ERROR_UNSUPPORTED_SAMPLE_RATE
     * @see IaraEvent.ERROR_RECORD_INTERRUPTION
     * @see IaraEvent.ALS_OFFLINE
     *
     * @alias IaraEvent.ERROR
     */
    ERROR = "iaraError",
    /**
     * Info
     *
     * @alias IaraEvent.ERROR_NO_INPUT_DEVICE
     */
    ERROR_NO_INPUT_DEVICE = "iaraErrorNoInputDevice",
    /**
     * Info
     *
     * @alias IaraEvent.ERROR_UNSUPPORTED_SAMPLE_RATE
     */
    ERROR_UNSUPPORTED_SAMPLE_RATE = "iaraErrorUnsupportedSampleRate",
    /**
     * Info
     *
     * @alias IaraEvent.ERROR_RECORD_INTERRUPTION
     */
    ERROR_RECORD_INTERRUPTION = "iaraErrorRecordInterruption",
    /**
     * Info
     *
     * @alias IaraEvent.NEWER_VOICE_MODEL_AVAILABLE
     */
    NEWER_VOICE_MODEL_AVAILABLE = "iaraNewerVoiceModelAvailable",
    /**
     * Info
     *
     * @alias IaraEvent.INSTALLED_ALS_VERSION_AVAILABLE
     */
    INSTALLED_ALS_VERSION_AVAILABLE = "iaraInstalledALSVersionAvailable",
    /**
     * Info
     *
     * @alias IaraEvent.NEWER_ALS_AVAILABLE
     */
    NEWER_ALS_AVAILABLE = "iaraNewerALSAvailable",
    /**
     * Info
     *
     * @alias IaraEvent.OGG_FILE_EXPORTED
     */
    OGG_FILE_EXPORTED = "iaraOggFileExported",
    /**
     * Info
     *
     * @alias IaraEvent.OGG_FILE_UPLOADED
     */
    OGG_FILE_UPLOADED = "iaraOggFileUploaded"
}

declare class IaraEventDetail {
    /**
     * Tipo do evento, que pode ser qualquer um dos eventos nomeados como `IaraEvent.*`.
     */
    type: IaraEvent;
    constructor(
    /**
     * Tipo do evento, que pode ser qualquer um dos eventos nomeados como `IaraEvent.*`.
     */
    type: IaraEvent);
    toString(): string;
}

declare class IaraFeedbacks<T> {
    /**
     * @ignore
     */
    private _iaraContext;
    private _MOODS;
    private _SUBJECTS;
    mock: boolean;
    get MOODS(): Record<string, {
        emoji: string;
        text: string;
    }>;
    get SUBJECTS(): Record<string, string>;
    constructor(
    /**
     * @ignore
     */
    _iaraContext: IaraSpeechRecognitionContext<T>);
    /**
     * Envia um novo feedback para a API Iara
     *
     * @param {string} text string que representa o feedback dado pelo usuário.
     * @param {string} subject o tópico do feedback do usuário @see this._SUBJECTS.
     * @param {object} mood o humor do feedback do usuário @see this._MOODS.
     *
     * @class
     */
    submit(text: string, subject: string, mood: {
        emoji: string;
        text: string;
    }, callback?: () => void, callbackContext?: T): void;
}

declare abstract class IaraHTTPConnector<T, D, P> {
    /**
     * A reference to the Iara namespace.
     * @ignore
     */
    protected _iaraContext: IaraSpeechRecognitionContext<T>;
    /**
     * URL that this connector will make requests to.
     *
     * @ignore
     */
    protected _urlSuffix: string;
    /**
     * Object formatted as `{headerName: "headerContent"}` that will be used to
     * add headers to all requests made by this connector.
     *
     * @ignore
     */
    protected _baseHeaders: {
        [key: string]: string;
    };
    private _callback;
    protected abstract _BASE_CONNECTOR_URL: string;
    protected abstract _CONTENT_TYPE: ContentType;
    private _request;
    private _responseData;
    constructor(
    /**
     * A reference to the Iara namespace.
     * @ignore
     */
    _iaraContext: IaraSpeechRecognitionContext<T>, 
    /**
     * URL that this connector will make requests to.
     *
     * @ignore
     */
    _urlSuffix: string, 
    /**
     * Object formatted as `{headerName: "headerContent"}` that will be used to
     * add headers to all requests made by this connector.
     *
     * @ignore
     */
    _baseHeaders: {
        [key: string]: string;
    });
    /**
     * Builds the complete Iara's API URL for this connector to call when perfirming method calls.
     *
     * @ignore
     */
    private _buildEndpointURL;
    /**
     *
     * @param {object} headers
     */
    private _setRequestHeaders;
    /**
     * Invokes the API method that this connector represents.
     *
     * @ignore
     */
    protected _call<C>(params: P, callback: (response?: D, error?: Event) => void, callbackContext: C, urlSuffix?: string): void;
    /**
     * A shorthand version of `call()` with a `params` property named `method`
     * pre-configured with a value `GET`.
     *
     * @ignore
     *
     * @see call()
     */
    get<C>(params: P, callback: (response?: D, error?: Event) => void, callbackContext: C): void;
    /**
     * A shorthand version of `call()` with a `params` property named `method`
     * pre-configured with a value `POST`.
     *
     * @ignore
     *
     * @see call()
     */
    post<C>(params: P, callback: (response?: D, error?: Event) => void, callbackContext: C): void;
    /**
     * A shorthand version of `call()` with a `params` property named `method`
     * pre-configured with a value `PATCH`.
     *
     * @ignore
     *
     * @see call()
     */
    patch<C>(pk: number | string, params: P, callback: (response?: D, error?: Event) => void, callbackContext: C): void;
    /**
     *
     * @ignore
     */
    private _onload;
    /**
     *
     * @ignore
     */
    private _onerror;
    /**
     *
     * @ignore
     */
    private _onresponse;
    private _invokeCallback;
    protected _formatData(contentType: ContentType, obj: P, ignoreFields: string[]): string;
    protected _objToJsonString(obj: P, ignoreFields: string[]): string;
    /**
     * Converts a object to a URL query param format. For example,
     * object `{hi: "test", id: 2}` becomes `"hi=test&id=2"`. This
     * method *does not* work recusiverly, so nested object structures
     * will be ignored.
     *
     * @ignore
     * @copyright https://stackoverflow.com/a/1714899/29827
     */
    private _objToURLQueryParam;
    private _addRequiredHeaders;
    /**
     * Makes a non-recursity _copy of the informed object.
     *
     */
    protected _copy(obj: P): P;
}

export declare interface IaraInferenceBookmark {
    content: string;
    inferenceId?: string;
    inferenceText?: string;
    name: string;
    recordingId?: string;
}

export declare interface IaraInferenceMessage {
    command?: string;
    iaraInference?: string;
    iaraIntermediateInference?: string;
    parsed?: string;
}

declare class IaraInitDetail extends IaraEventDetail {
    type: IaraEvent;
    /**
     * Algum tipo de dado associado com o tipo do passo de inicialização. Se a propriedade `type`
     * for `IaraEvent.INIT_VOICE_MODEL_DOWNLOAD_PROGRESS`, a propriedade `data` contém um inteiro
     * com valor variando de 0 a 100 indicando o progresso do download do modelo de voz do usuário.
     */
    data?: string | number | {
        downloadUrl: string;
        version: string;
    };
    developerMessage: string;
    errorCode: number;
    moreInfo: string;
    userMessage: string;
    constructor(type: IaraEvent, 
    /**
     * Algum tipo de dado associado com o tipo do passo de inicialização. Se a propriedade `type`
     * for `IaraEvent.INIT_VOICE_MODEL_DOWNLOAD_PROGRESS`, a propriedade `data` contém um inteiro
     * com valor variando de 0 a 100 indicando o progresso do download do modelo de voz do usuário.
     */
    data?: string | number | {
        downloadUrl: string;
        version: string;
    });
    toString(): string;
}

declare class IaraInternalDetail<T, C> extends IaraEventDetail {
    /**
     * Dados relacionados a esse evento.
     */
    data: {
        emitter?: IaraServiceConnector<C> | IaraASRManager<C> | IaraDeviceManager<C> | IaraParserRules<C> | C | Record<string, unknown>;
        error?: Event;
        graceful?: boolean;
        message?: T extends null | undefined ? string : Message<T>;
        scope?: string;
    };
    constructor(
    /**
     * Dados relacionados a esse evento.
     */
    data: {
        emitter?: IaraServiceConnector<C> | IaraASRManager<C> | IaraDeviceManager<C> | IaraParserRules<C> | C | Record<string, unknown>;
        error?: Event;
        graceful?: boolean;
        message?: T extends null | undefined ? string : Message<T>;
        scope?: string;
    });
    toString(): string;
}

declare enum IaraKeyboardLayouts {
    ABNT_2 = "ABNT2",
    US_INTERNATIONAL = "US International"
}

declare interface IaraLanguages {
    language: {
        syncfusionTranslate: (typeof default_2)["es"] | (typeof default_3)["pt-BR"];
        iaraTranslate: {
            customfields: {
                header: string;
                content: string;
                add: string;
                mandatory: string;
                tipText: {
                    title: string;
                    content: string;
                };
                optional: string;
                additive: string;
                next: string;
                previous: string;
            };
            changes: {
                trackchanges: string;
                header: string;
            };
            saveMessage: {
                success: string;
                error: string;
                loading: string;
            };
            additiveFieldModal: {
                modalTitle: string;
                titleField: string;
                titlePlaceholder: string;
                configTitle: string;
                delimiterStartField: string;
                delimiterStartRequired: string;
                delimiterFinalField: string;
                delimiterFinalPlaceholder: string;
                delimiterFinalRequired: string;
                additiveTextsTitle: string;
                additiveTextsHeaderIdentifier: string;
                additiveTextsHeaderPhrase: string;
                addTextBtn: string;
                modalBtnOk: string;
                modalBtnCancel: string;
            };
        };
    };
}

declare class IaraLogger<T> {
    /**
     * A reference to the Iara namespace.
     * @ignore
     */
    private _iaraContext;
    private _backlog;
    private _IARA_LOGGER_PREFIX;
    constructor(
    /**
     * A reference to the Iara namespace.
     * @ignore
     */
    _iaraContext: IaraSpeechRecognitionContext<T>);
    downloadBacklogAsFile(fileName?: string): void;
    getBacklogAsDataApplicationOctetStream(): string;
    private _addToBacklog;
    /**
     * @ignore
     */
    log(...args: unknown[]): void;
    /**
     * @ignore
     */
    info(...args: unknown[]): void;
    /**
     * @ignore
     */
    warn(...args: unknown[]): void;
    /**
     * @ignore
     */
    debug(...args: unknown[]): void;
    /**
     * @ignore
     */
    error(...args: unknown[]): void;
}

export declare interface IaraMediaDeviceInfo extends MediaDeviceInfo {
    communication?: boolean;
    default?: boolean;
}

declare interface IaraNavigationBookmark {
    name: string;
    content: string;
    title: string;
    offset: {
        start: string;
        end: string;
    };
    additive?: IaraAdditiveBookmark;
}

declare class IaraParserRules<T> {
    /**
     * @ignore
     */
    private _iaraContext;
    private _DIRECTIONS;
    rules: ParserRules;
    private _finalWordBoundary;
    private _startWordBoundary;
    constructor(
    /**
     * @ignore
     */
    _iaraContext: IaraSpeechRecognitionContext<T>);
    init(): void;
    private _applyApiRules;
    private _applyCapitalizationRules;
    private _applyGeneralRules;
    private _applyNumberRules;
    private _applyNumbersInFullRules;
    private _applyOrdinalNumeralRules;
    private _applyMammographyRules;
    private _applyPathologyRules;
    private _applyRomanNumeralRules;
    private _applyVertebraeRules;
    private _mergeNumbersInFull;
    private _revertNumberCornerCases;
    private _removeExtraSpaces;
    applyParserRules(text: string): string;
    /**
     * Load the user`s parser rules from the Iara API
     */
    loadRules(): void;
}

export declare interface IaraParserRulesMessage {
    asrRules?: string;
}

export declare interface IaraRecorderMessage {
    audioError?: string;
    audioLevelUpdate?: number;
    errorCode?: number;
    iaraError?: string;
    linesInfo?: LinesInfo;
    voiceActivity?: string;
    volumeInfo?: {
        input: number;
        output: number;
    };
}

declare class IaraRecordManager<T> {
    /**
     * Reference to the Iara namespace.
     *
     * @ignore
     */
    private _iaraContext;
    private _browserMic;
    private _knownInputDevicesWhenErrorSignaled;
    private _linesInfo?;
    private _nativeMic;
    private _recordingEngine?;
    volumeInfo: {
        input: number;
        output: number;
    };
    get audioContext(): AudioContext;
    get audioAnalyser(): AnalyserNode;
    get recordingEngine(): RecordingEngine;
    constructor(
    /**
     * Reference to the Iara namespace.
     *
     * @ignore
     */
    _iaraContext: IaraSpeechRecognitionContext<T>);
    /**
     * The preventSendingToALS parameter is passed to the browserMic to avoid sending audio data to the ALS.
     * This behavior is required when using the self training feature.
     */
    startRecording(preventSendingToALS?: boolean, disableSpeechRecognition?: boolean): void;
    /**
     *
     */
    stopRecording(): Blob | Promise<Blob> | void;
    /**
     *
     */
    stopRecognition(): void;
    /**
     *
     * @param type {String} `RecordingEngine.ALS_RECORDING` or `RecordingEngine.BROWSER_RECORDING`.
     */
    setRecordingEngine(type: RecordingEngine, callback?: (error?: number) => void, callbackContext?: T): void;
    processEndpointMessage(endpoint: WebSocket, message: IaraRecorderMessage): void;
    private _handleBrowserMicUnsupportedErrors;
    private _handleRecorderMessage;
    private _handleAudioErrorRecorderMessage;
    private _handleIaraErrorRecorderMessage;
    private _processAudioLevelUpdate;
    isUsingOrWillUseBrowserRecording(): boolean;
    /**
     * Updates the `audioInputs` and `audioOutputs` properties of the Iara public facing API with the information
     * returned by the ASL Recorder endpoint regarding available audio devices.
     */
    private _updateAudioInputsOutputs;
    /**
     * Checks if audio devices were added or removedEmit events and hook
     */
    private _updateKnownLinesInfo;
    private _signalErrorIfNoInputDeviceAvailable;
    /**
     * Updates the volume information of audio input/output devices. Users can get that value by
     * calling the public-facing method `getAudio{Input,Output}Volume()`.
     */
    private _updateVolumeInfoForAudioDevices;
    private _assertValidAudioDeviceCategory;
    /**
     * Sets a specific audio device by its id.
     *
     * @param deviceId {int} id of the audio device to be selected
     * @param deviceCategory {string} either `intput` or `output` for input and output audio devices, respectively.
     * @param callback {Function} callback to be invoked when this action finishes.
     */
    setAudioDevice(deviceId: string, deviceCategory: string, callback: () => void): void;
    private _setAudioDeviceUsingALS;
    private _setAudioDeviceUsingBrowser;
    /**
     * Sets the input/output volume for the currently selected audio device.
     *
     * @param volume {Number} volume to be used, where 0 is the lowest value and 1 is the highest. 0.5 is the default.
     * @param deviceCategory {string} either `intput` or `output` for input and output audio devices, respectively.
     * @param callback {Function} callback to be invoked when this action finishes.
     */
    setAudioVolume(volume: number, deviceCategory: string, callback: () => void): void;
    /**
     * Gets info about a device with a particular name pattern.
     *
     * @param nameRegex {Regex} id of the audio device to be selected
     * @param deviceCategory {string} either `intput` or `output` for input and output audio devices, respectively.
     *
     * @return {Array} array containing the devices that match the informed name pattern, or an empty array if nothing is found.
     */
    findAudioDeviceByNamePattern(nameRegex: RegExp, deviceCategory: string): ALSAudioInputOutput[];
    requestGetLinesInfo(): void;
    private _enumerateBrowserDevicesAsRecorderInputOutputMessage;
    requestBrowserGetLinesInfo(shouldAwait?: boolean): Promise<void>;
    requestALSGetLinesInfo(): void;
}

declare class IaraReport<T> {
    private _iaraContext;
    private _key;
    private _richText;
    private _text;
    private _LOG_PREFIX;
    constructor(_iaraContext: IaraSpeechRecognitionContext<T>);
    /**
     * @param type {String} (optional) the report`s initial text
     * @param type {String} (optional) the report`s initial text in html format
     */
    begin(text: string, richText: string, metadata?: Record<string, unknown>): Promise<string>;
    /**
     * @param type {String} the report`s text to be changed
     * @param type {String} the report`s text in html format to be changed
     */
    change(text: string, richText: string, metadata?: Record<string, unknown>): Promise<string>;
    /**
     * @param type {String} the report`s final text
     * @param type {String} the report`s final text in html format
     */
    finish(text: string, richText: any, metadata?: Record<string, unknown>): Promise<void>;
    private _onSubmitError;
    private _submit;
}

declare class IaraRichTranscriptTemplates<T> {
    private _iaraContext;
    private _internal;
    get templates(): {
        [key: string]: Template;
    };
    constructor(_iaraContext: IaraSpeechRecognitionContext<T>);
    init(): void;
    /**
     * callback: fn(resultEvent, templateContext, config)
     */
    add(findText: string | string[], replaceText: string, callback?: TemplateCallback<void>, config?: TemplateConfig, metadata?: unknown): boolean;
    private _addSimpleTemplate;
    private _addEnclosedTemplate;
    private _addTemplate;
    private _isStringValid;
    process(resultEvent: CustomEvent<IaraSpeechRecognitionDetail>): void;
    private _informTemplatesChangedRichTranscript;
    private _handleRichTranscriptTemplateApplied;
    private _configFnTemplateFunction;
    private _applyTemplateLogic;
    private _shouldApplyTemplateLogic;
    exists(findText: string): void;
    private _find;
    /**
     * @ignore
     */
    remove(text: string, replaceText: string): boolean;
    /**
     * newFindText (optional): replace the found template's text property with newText
     * newReplaceText (optional): replace the found template's replaceText property with newReplaceText
     */
    change(findText: string, replaceText: string, newFindText: string, newReplaceText: string): boolean;
}

export declare interface IaraRobotMessage {
    robotError?: string;
}

declare class IaraSelfTraining<T> {
    private _iaraContext;
    private _entries;
    private _LOG_PREFIX;
    constructor(_iaraContext: IaraSpeechRecognitionContext<T>);
    processEndpointMessage(endpoint: WebSocket, message: IaraASRMessage): Promise<void>;
    private _handleOnIaraAudioFromASRmessage;
    submitSelfTraining(message: {
        audio: Blob;
        transcript: string;
    }, callback: (error: Error | null, result: string) => void, callbackContext?: T): void;
    private _submitValidation;
}

declare class IaraServiceConnector<T> {
    /**
     * URL used by this connector to talk to the ALS.
     *
     * @ignore
     */
    private _endpointName;
    /**
     * A reference to the Iara namespace.
     * @ignore
     */
    private _iaraContext;
    config?: Config;
    private _endpointPrefix;
    private _endpointPrefixFallback;
    private _hasErrors;
    private _shouldEmitHookBeforeSend;
    private _shouldProcessInitStep;
    private _shouldProcessOngoingMessages;
    private _shouldTryFallbackPrefix;
    private _terminating;
    private _ws;
    get endpointName(): string;
    get hasErrors(): boolean;
    get shouldTryFallbackPrefix(): boolean;
    get ws(): ICustomWebSocket<T, IaraServiceConnector<T>>;
    constructor(
    /**
     * URL used by this connector to talk to the ALS.
     *
     * @ignore
     */
    _endpointName: string, 
    /**
     * A reference to the Iara namespace.
     * @ignore
     */
    _iaraContext: IaraSpeechRecognitionContext<T>, config?: Config);
    /**
     * Initializes the object and connects to the endpoint.
     *
     * @ignore
     */
    init(initParams: InitParams): void;
    isConnecting(): boolean;
    isReady(): boolean;
    terminate(): void;
    send<M = Record<string, unknown>>(message: M extends null | undefined ? string : Message<M>, quiet?: boolean): void;
    private _onopen;
    private _onerror;
    private _onmessage;
    private _onclose;
}

export declare class IaraSFDT {
    value: string;
    private _editor;
    static IARA_API_URL: string;
    html: string | undefined;
    plainText: string | undefined;
    rtf: string | undefined;
    constructor(value: string, _editor: DocumentEditor);
    static detectContentType(content: string): IaraSyncfusionContentTypes;
    static fromContent(content: string, editor: DocumentEditor): Promise<IaraSFDT>;
    static fromEditor(editor: DocumentEditor): Promise<IaraSFDT>;
    static import(content: string, editor: DocumentEditor, contentType?: IaraSyncfusionContentTypes): Promise<IaraSFDT>;
    static toHtml(content: string): Promise<string>;
    static toRtf(content: string): Promise<string>;
    static toPdf(content: any, config?: IaraSyncfusionConfig): void;
    static editorToPlainText(editor: DocumentEditor): Promise<string>;
    toHtml(): Promise<string>;
    toRtf(): Promise<string>;
    toPlainText(): Promise<string>;
    toString(): string;
}

declare class IaraShortcutDetail extends IaraEventDetail {
    data: KeyboardMessage;
    constructor(data: KeyboardMessage);
    toString(): string;
}

declare class IaraShortcuts<T> {
    private _iaraContext;
    private _preventCTRLShortcuts;
    builtInPresetsEnabled: boolean;
    enabled: boolean;
    speechmikeBuiltInPresetsEnabled: boolean;
    recordingToggleEvents: string[];
    set preventCTRLShortcuts(prevent: boolean);
    constructor(_iaraContext: IaraSpeechRecognitionContext<T>);
    /**
     * TODO: implement this
     */
    private _add;
    handleSpeechMikeShortcuts(message: SpeechMikeMessage): void;
    emitKeyboardShortcutEvents(message: KeyboardMessage): void;
    handleKeyboardShortcuts(message: KeyboardMessage): void;
}

declare class IaraSpeechmikeButtonPressDetail extends IaraEventDetail {
    /**
     * TODO: add docs
     */
    data: SpeechMikeMessage;
    constructor(
    /**
     * TODO: add docs
     */
    data: SpeechMikeMessage);
    toString(): string;
}

/**
 *
 * This is the JS implementation of the Iara Speech SDK which makes your
 * application able to perform voice recognition using the technology developed
 * by Iara Health.
 *
 * @see https://developers.iarahealth.com/sdk
 * @license Copyright 2019 Iara Health - All rights reserved.
 */
/**
 * Disponibiliza as funcionalidades de reconhecimento de voz da Iara.
 *
 * @class
 */
export declare class IaraSpeechRecognition {
    private _context;
    private _externalEditor;
    private _prevRecordingEngine;
    addEventListener: (type: string, listener: (e?: CustomEvent) => void, options?: boolean | AddEventListenerOptions) => void;
    audioInputs?: ALSAudioInputOutput[];
    audioOutputs?: ALSAudioInputOutput[];
    automation: IaraAutomation<IaraSpeechRecognition>;
    commands: IaraCommands<IaraSpeechRecognition>;
    dispatchEvent: (event: CustomEvent) => boolean;
    engine: string;
    env: IaraEnvDetector;
    feedbacks: IaraFeedbacks<IaraSpeechRecognition>;
    interimResults: boolean;
    lang: string;
    parserRules: IaraParserRules<IaraSpeechRecognition>;
    ready: boolean;
    removeEventListener: (type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean) => void;
    report: IaraReport<IaraSpeechRecognition>;
    richTranscriptTemplates: IaraRichTranscriptTemplates<IaraSpeechRecognition>;
    selfTraining: IaraSelfTraining<IaraSpeechRecognition>;
    shortcuts: IaraShortcuts<IaraSpeechRecognition>;
    status: IaraStatus;
    transcriptHistory: {
        date: Date;
        detail: any;
    }[];
    useVAD: boolean;
    version: string;
    onresult: (event?: CustomEvent<IaraSpeechRecognitionDetail>) => void;
    onstart: (event?: CustomEvent) => void;
    onstop: (event?: CustomEvent) => void;
    oninitdone: (event?: CustomEvent) => void;
    oninitfail: (event?: CustomEvent) => void;
    oninitprogress: (event?: CustomEvent<IaraInitDetail>) => void;
    onready: (event?: CustomEvent) => void;
    onaudiolevelupdate: (event?: CustomEvent<IaraAudioLevelUpdateDetail>) => void;
    onaudiodeviceadd: (event?: CustomEvent<IaraAudioDeviceDetail>) => void;
    onaudiodeviceremove: (event?: CustomEvent<IaraAudioDeviceDetail>) => void;
    onaudiodevicechange: (event?: CustomEvent<IaraAudioDeviceDetail>) => void;
    onshortcut: (event?: CustomEvent<IaraShortcutDetail | IaraSpeechmikeButtonPressDetail>) => void;
    onerror: (event?: CustomEvent) => void;
    onalsoffline: (event?: CustomEvent<IaraEventDetail>) => void;
    onalsonline: (event?: CustomEvent<IaraEventDetail>) => void;
    onfetchrecording: (event?: string) => void;
    get templates(): {
        [key: string]: Template;
    };
    static ScriptUrl: string;
    constructor();
    get internal(): IaraSpeechRecognitionContext<IaraSpeechRecognition>;
    get recordManager(): IaraRecordManager<IaraSpeechRecognition>;
    set useExternalEditor({ enabled, keyboard, robotDelay, stopRecognitionCallback, }: {
        enabled: boolean;
        keyboard?: IaraKeyboardLayouts;
        robotDelay?: number;
        stopRecognitionCallback?: () => void;
    });
    set externalEditorKeyboard(keyboard: IaraKeyboardLayouts);
    set volumeEstimation(config: VolumeEstimation);
    /**
     * Disables/enables recordings. If the recording is disabled and the user tries
     * to start a new recording, an error is thrown.
     *
     * @param value {Boolean} `true` to disable all recordings, or `false` to enable them.
     * @param reason {String} string contatining the reason why the recording is currently disabled. If this text is not empty, it is used as the error message issued when a new recording is attempted and recordings are disabled.
     */
    private _setRecordingDisabled;
    /**
     * Returns an entry that describes a callback that must be invoked. This function
     * will look for the callback in the `internal.pendingCallbackCalls` list and will
     * actually *remove* the entry from the list and return it. It means that if the
     * function successfully finds the callback to be called, it will remove such callback
     * entry from `pendingCallbackCalls`.
     *
     * @param id {string} unique identifier for this callback entry.
     * @returns {object} a object that contextualizes the callback with a structure like `{id: STRING, func: FUNCTION}`.
     */
    extractPendingCallbackCallById(id: string): {
        id: string;
        func: () => void;
    } | null;
    /**
     * Adds a callback to be the pool of functions that need to be invoked when actions unfold.
     *
     * @param id {string} a unique string that identifies the callback, e.g. `changeDevice20102`. This id will be used to recover the callback later on.
     * @param callback {Function} function to be invoked as a callback.
     */
    addPendingCallbackCall(id: string, callback: () => void): void;
    /**
     * Sends a message to the ALS using one of the available endpoints.
     */
    send(endpoint: WebSocket, message: Message): void;
    private _setupAPIConnectors;
    /**
     * Commands the ALS to init Iara stuff.
     */
    iaraInit(): void;
    private _buildALSIaraInitObject;
    /**
     * Check if a init param is also available as a public facing or internal
     * property in the recognizer, e.g. recognizer.interimResults. If
     * that is the case, update the internal/public property with the
     * supplied value if and only if the prop has no value or "force" is true.
     */
    private _updateSDKPropertyFromInitParamName;
    /**
     * Ajust the internal property `initParams` based on user provided properties
     * and the available properties. If it finds any unknown property, an exception
     * is thrown.
     */
    private _setupInitParams;
    /**
     * Performs a full init of the SDK, calling the callback functions the
     * user provided, e.g. done().
     *
     * @param params {object} Object whose properties indicate config settings.
     */
    private _init;
    /**
     * Invoked by `authenticateWithIaraAPI()` when the SDK has everything it needs from the Iara API
     * to perform a local init, e.g. API version, ALS version to use, etc.
     *
     */
    private _initBasedOnIaraAPIConfig;
    initALSConnectors(): void;
    private _assignAuthTokenToIaraAPIMandatoryHeaders;
    private _authenticateWithIaraAPI;
    private _fetchRequiredInitInfoFromIaraAPI;
    private _loadSdkVersionsFromIaraAPI;
    private _loadASRVersionsFromIaraAPI;
    private _loadSpeechParametersFromIaraAPI;
    private _loadAuthUserFromIaraAPI;
    private _runInternalSetupBasedOnInitParams;
    private _generateAlsInstallInfo;
    /**
     * Invokes a pending callback using its object structure as found in the
     * `internal.pendingCallbackCalls` list.
     *
     * @param pendingCallbackObject {object} Object describing the callback in the form of  `{id: STRING, func: FUNCTION}`.
     */
    invokePendingCallback(pendingCallbackObject: {
        id: string;
        func: () => void;
    }): void;
    /**
     * Sets the `status` property of the Iara public facing API. If also monitors for a particular
     * status to also update the `ready` property accordingly.
     */
    private _setStatus;
    /**
     * Maps an ALS audioError message's error code to our own error codes
     *
     * @see IaraEvent.ERROR
     * @see IaraEvent.INIT_FAIL
     */
    mapAudioErrorCodeFromAlsRecorderToSdk(errorCode: number, errorType: IaraEvent): number;
    /**
     * Returns the correct userMessage for given error code
     * @param errorCode {number} code that indicates wich error occurred.
     * @param complementaryMessage {string} used to give more detail about the error to the user
     */
    private _getUserMessageFromSdkErrorCode;
    /**
     * Returns the correct developerMessage for given error code
     * @param errorCode {number} code that indicates wich error occurred.
     * @param complementaryMessage {string} used to give more detail about the error to the developer
     */
    getDeveloperMessageFromSdkErrorCode(errorCode: number, complementaryMessage?: string | Event): string;
    /**
     * Maps an ALS iaraError message's error code to our own error codes
     *
     * @see IaraEvent.ERROR
     * @see IaraEvent.INIT_FAIL
     */
    mapErrorCodeFromAlsRecorderToSdk(errorCode: number, errorType: IaraEvent): number;
    /**
     * Process any update regarding the initialization of the SDK.
     *
     * @param endpoint {object} reference to the endpoint that issued the command.
     * @param message {object} message sent by the endpoint.
     */
    processInitStep(endpoint: WebSocket, message: Message): void;
    private _handleIaraErrorDuringProcessInitStep;
    private _handleAlsDisconnectedForceConnection;
    private _processInitStepIaraVoiceModelSync;
    private _preventRepeatedTooSoonCalls;
    /**
     * @param string methodName name of the method that will be tested.
     * @param array argsArray array containing the arguments that `methodName` received, e.g. `myMethod(1, 2, 'test')` results in `isTooSoonToDoSomething('myMethod', 1, 2, 'test')`. If not informed, only the method name will be used to calculate the time.
     * @return bool `true` if the method has been called recently (in less than `internal.settings.tooSoonToDoSomethingIntervalMilli`)
     */
    private _isTooSoonToDoSomething;
    makeInitFail(errorCode: number, developerMessageSuffix?: string, userMessageSuffix?: string): void;
    private _shutdownBecauseFailure;
    private _processInitStepIaraStatusReady;
    /**
     * Tries to init the input method using the best device available.
     */
    private _initInputMethodAsAuto;
    /**
     * Tries to init the input method using a SpeeckMike.
     *
     * @param sucessCallback {Function} callback in the format `callback(void)` invoked when the operation completes successfully.
     * @param failCallback {Function} callback in the format `callback(String err, String triedInput)` invoked when the operation fails.
     * @param callbackContext {Object} the `this` where the callbacks will be invoked.
     */
    private _initInputMethodAsSpeechMike;
    /**
     * Tries to init the input method using the browser microphone.
     *
     * @param sucessCallback {Function} callback in the format `callback(void)` invoked when the operation completes successfully.
     * @param failCallback {Function} callback in the format `callback(String err, String triedInput)` invoked when the operation fails.
     * @param callbackContext {Object} the `this` where the callbacks will be invoked.
     */
    private _initInputMethodAsBrowserMic;
    /**
     * Tries to init the input method using the browser microphone.
     *
     * @param sucessCallback {Function} callback in the format `callback(void)` invoked when the operation completes successfully.
     * @param failCallback {Function} callback in the format `callback(String err, String triedInput)` invoked when the operation fails.
     * @param callbackContext {Object} the `this` where the callbacks will be invoked.
     */
    private _initInputMethodAsOSMic;
    private _assertAnyInputMethodIsAvailable;
    private _processInitBasedOnProvidedInputMethod;
    private _signalInitInputMethodSuccessful;
    private _getCurrentInitDurationMilli;
    private _signalSuccessfulInit;
    /**
     * Issues an error signal to all channels of the SDK, such as `onerror`, events
     * and hooks. This method is an elegant way of signaling problems without crashing
     * the app the SDK is running within.
     *
     */
    signalError(errorCode: number, developerMessageSuffix?: string | Event, eventType?: IaraEvent): void;
    processInitStepIaraProgress(specificType: IaraEvent, detailData?: number | string | {
        downloadUrl: string;
        version: string;
    }): void;
    private _createRichTranscriptFromTexts;
    private _beforeResultEventDispatch;
    private _recognitionIsFirstInCurrentRecordingContext;
    private _dispatchResultEvents;
    private _addResultToTranscriptHistory;
    /**
     * Process Iara inferece messages, e.g. `iaraInference` and `iaraIntermediateInference`. This
     * method will check the inference type (final, intermediate, etc), extract the useful text,
     * then dispatch events, e.g. `onresult`.
     *
     * @param message {object} message sent by ALS as a result of an inteference.
     */
    private _processRawIaraInferecenseMessage;
    private _isTextEqualToLastTranscript;
    processOngoingMessages(endpoint: WebSocket, message: Message): void;
    private _invokeProcessEndpointMessageOnListeners;
    private _processAudioFileExported;
    private _processStoppedRecording;
    private _processStartedRecordingAt;
    private _startInterimResultsPolling;
    stopInterimResultsPolling(): void;
    private _processAudioInputOutputTest;
    /**
     * Sets the LEDs indicators of any SpeechMike plugged-in into the machine.
     * If the function parameter is not specified, all LED indicators at turned off. Any LEDs
     * button not mentioned in the `buttons` param will be set to OFF.
     *
     * Available buttons: 'topGreen', 'topRed', 'eolGreen', 'eolRed', 'insertGreen', 'insertRed', 'f1', 'f2', 'f3', 'f4'.
     * Available values: 'OFF', 'SLOW', 'FAST', 'SOLID'.
     *
     * @param {object} buttons Dictionary with `key:value`, where `key` is the name of a button and `value` its behavior. E.g. `topGreen:'SLOW'`.
     */
    setSpeechMikeLEDs(buttons: SpeechMikeButton): void;
    /**
     * Toggle the current recording state. If something is being recored, i.e. `start()`
     * was previously pressed, call `stop()`. If nothing is being recored, i.e. `stop()`
     * was previously pressed or nothing was pressed yet, call `start()`.
     */
    toggleRecording(): void;
    private _adjustIsRecordingState;
    private _processRecordingDownload;
    private _processRecordingInterruptions;
    /**
     * Invoked by several sections of the SDK code when something relevant happens.
     * For instance, this method is invoked every time an event is dispatched.
     *
     * @see dispatchEventAndInternalHook()
     */
    onHook<T extends IaraEventDetail>(event: CustomEvent<T>, data: T): void;
    private _checkInitHealth;
    private _trackHookForInitReadiness;
    private _makeInitCompleteIfMeetTrackedHookScopes;
    /**
     * Dispatches the event externally to all listeners and also invokes
     * the internal `onHook` method to notify internal components that something
     * important just happened.
     */
    dispatchEventAndInternalHook<T = unknown>(event: CustomEvent<T>, data?: any): void;
    /**
     * Initializes all required services to perform speech recognition, including authentication with
     * the Iara API, download of voice models, etc.
     *
     * @param {object} params objeto cujas propriedades serão usadas para customizar a inicialização.
     */
    init(params: InitParams): InitStructure;
    private _assertRecognitionCanHappen;
    private _emitEventAndHookRecognitionStarting;
    /**
     * Inicia o reconhecimento de voz da Iara com base no dispositivo de entrada de audio.
     *
     * @param startedRecordingCallback {Function}
     * @return {Boolean} `true` se o processo de gravação seguirá, ou `false` caso contrário.
     *
     * @see stop()
     * @see onresult()
     * @see setAudioInput()
     * @see testAudioInputOutput()
     */
    start(startedRecordingCallback?: () => void): boolean;
    /**
     * Stops the speech recognition service from listening to incoming audio, and attempts to return a `IaraSpeechRecognitionDetail` using the audio captured so far.
     *
     * @see start()
     * @see onresult()
     * @see onstop()
     * @see setAudioInput()
     * @see testAudioInputOutput()
     */
    stop(): void;
    /**
     * Executa o reconhecimento de voz da Iara em um arquivo de audio. O resultado do reconhecimento
     * será propagado através de eventos da mesma forma se `start()` e `stop()` tivessem sido chamados.
     * Por enquanto, apenas suportamos arquivos wav com sample rate de 44100Hz.
     *
     * @param contentAsBase64 {string} arquivo de audio codificado como base64. No momento, suporta apenas wav `data:audio/wav;base64`.
     * @param config {obj} configurações ou informações adicionais necessárias para o processamento do arquivo.
     * @return {Boolean} `true` se o processo de gravação seguirá, ou `false` caso contrário.
     *
     * @see start()
     * @see stop()
     * @see onresult()
     * @see setAudioInput()
     * @see testAudioInputOutput()
     */
    startFromAudioFileContent(contentAsBase64: string, _config?: Record<string, unknown>): boolean;
    /**
     * Escolhe um determinado dispositivo de audio de entrada para ser usado nas gravações.
     *
     * @param deviceId {int} id do dispositivo a ser usado como entrada de audio. O id dos dispositivos disponíveis pode ser consultado na propriedade `audioInputs`.
     * @param callback {Function} função chamada quando o dispositivo de audio especificado for, de fato, selecionado na máquina (ou se algum erro aconteceu). A seleção do dispositivo de audio, a nível de sistema operacional/browser, é assíncrona (demora alguns segundos para acontecer). Dessa forma, a utilização dessa callback é mandatória para garantir uma boa experiência ao usuário.
     *
     * @see audioInputs
     * @see audioOutputs
     * @see setAudioOutput
     * @see testAudioInputOutput
     */
    setAudioInput(deviceId: string, callback: () => void): void;
    /**
     * Escolhe um determinado dispositivo de audio para ser usado como meio de reprodução.
     *
     * @param deviceId {int} id do dispositivo a ser usado como saída de audio. O id dos dispositivos disponíveis pode ser consultado na propriedade `audioOutputs`.
     * @param callback {Function} função chamada quando o dispositivo de audio especificado for, de fato, selecionado na máquina (ou se algum erro aconteceu). A seleção do dispositivo de audio, a nível de sistema operacional/browser, é assíncrona (demora alguns segundos para acontecer). Dessa forma, a utilização dessa callback é mandatória para garantir uma boa experiência ao usuário.
     *
     * @see audioInputs
     * @see audioOutputs
     * @see setAudioInput
     * @see testAudioInputOutput
     */
    setAudioOutput(deviceId: string, callback: () => void): void;
    /**
     * Altera o volume do dispositivo de audio de saída.
     *
     * @param volume {Number} valor que representa o volume, variando de 0 (mais baixo possível) até 1 (mais alto possível). O valor de 0.5 é o default.
     * @param callback {Function} função chamada quando o volume do dispositivo de audio especificado for, de fato, alterado(ou se algum erro aconteceu). A troca do volume do dispositivo de audio, a nível de sistema operacional/browser, é assíncrona (demora alguns segundos para acontecer). Dessa forma, a utilização dessa callback é mandatória para garantir uma boa experiência ao usuário.
     *
     * @see audioInputs
     * @see audioOutputs
     * @see setAudioInput
     * @see setAudioInputVolume
     * @see getAudioInputVolume
     * @see getAudioOutputVolume
     * @see testAudioInputOutput
     */
    setAudioOutputVolume(volume: number, callback: () => void): void;
    /**
     * Altera o volume do dispositivo de audio de entrada.
     *
     * @param volume {Number} valor que representa o volume, variando de 0 (mais baixo possível) até 1 (mais alto possível). O valor de 0.5 é o default.
     * @param callback {Function} função chamada quando o volume do dispositivo de audio especificado for, de fato, alterado(ou se algum erro aconteceu). A troca do volume do dispositivo de audio, a nível de sistema operacional/browser, é assíncrona (demora alguns segundos para acontecer). Dessa forma, a utilização dessa callback é mandatória para garantir uma boa experiência ao usuário.
     *
     * @see audioInputs
     * @see audioOutputs
     * @see setAudioInput
     * @see setAudioOutputVolume
     * @see getAudioInputVolume
     * @see getAudioOutputVolume
     * @see testAudioInputOutput
     */
    setAudioInputVolume(volume: number, callback: () => void): void;
    /**
     * Obtém o volume do dispositivo de audio de saída.
     *
     * @return {Number} valor que representa o volume, variando de 0 (mais baixo possível) até 1 (mais alto possível). O valor de 0.5 é o default.
     *
     * @see audioInputs
     * @see audioOutputs
     * @see setAudioInput
     * @see setAudioInputVolume
     * @see setAudioOutputVolume
     * @see getAudioInputVolume
     * @see testAudioInputOutput
     */
    getAudioOutputVolume(): number;
    /**
     * Obtém o volume do dispositivo de audio de entrada.
     *
     * @return {Number} valor que representa o volume, variando de 0 (mais baixo possível) até 1 (mais alto possível). O valor de 0.5 é o default.
     *
     * @see audioInputs
     * @see audioOutputs
     * @see setAudioInput
     * @see setAudioInputVolume
     * @see setAudioOutputVolume
     * @see getAudioOutputVolume
     * @see testAudioInputOutput
     */
    getAudioInputVolume(): number;
    /**
     * Faz um teste de gravação e reprodução de audio utilizando os dispositivos de entrada e saída atualmente selecionados no sistema.
     *
     * @param recordDurationSeconds {Number} tempo, em segundos, que a gravação de teste de audio deve durar. Quando o tempo de gravação for atingido, a gravação será finalizada e a callback chamada.
     * @param onRecordCompleteCallback {Function} função chamada quando o tempo de gravação estipulado for atingido. Enquanto essa função for chamada, tanto o SDK quando o ALS estarão processando o arquivo de audio para que ele seja reproduzido no dispositivo de saída de audio selecionado.
     * @param onPlaybackCompleteCallback {Function} função chamada quando o audio de teste gravado terminar de ser reproduzido.
     *
     * @see audioInputs
     * @see audioOutputs
     * @see setAudioInput
     * @see setAudioOutput
     * @see setAudioInputVolume
     * @see setAudioOutputVolume
     * @see getAudioInputVolume
     * @see getAudioOutputVolume
     */
    testAudioInputOutput(recordDurationSeconds: number, onRecordCompleteCallback: () => void, onPlaybackCompleteCallback: () => void, dispatchEvents?: boolean): void;
    /**
     * Ativa ou desativa o modo debug do reconhecedor. Se o reconhecedor estiver em modo debug,
     * diversas mensagens são mostradas no console do navegador. Além disso, o SDK mantém um log
     * interno de todas as mensagens enviadas para o console do navegador.
     *
     * @param status {Boolean} `true` para colocar o reconhecedor em modo debug, ou `false` caso contrário.
     *
     * @see debugLogGetAsHrefData
     * @see debugLogDownload
     */
    setDebug(status: boolean): void;
    /**
     * Ativa ou desativa o modo debug do reconhecedor. Se o reconhecedor estiver em modo debug,
     * diversas mensagens são mostradas no console do navegador. Além disso, o SDK mantém um log
     * interno de todas as mensagens enviadas para o console do navegador.
     *
     * @param fileName {String} nome do arquivo que será baixado pelo browser. Se nada for informado, o SDK utilizá um nome baseado na data atual.
     *
     * @see setDebug
     * @see debugLogGetAsHrefData
     */
    debugLogDownload(fileName: string): void;
    /**
     *
     */
    debugLogGetAsOctetStream(): string;
    /**
     * Faz uma tentativa de reiniciar o ALS.
     *
     * @see upgradeALS
     * @see upgradeVoiceModel
     * @see checkForNewerVersions
     */
    restartALS(): void;
    /**
     * Solicita que o ALS se atualize para a versão mais recente.
     *
     * @see restartALS
     * @see checkForNewerVersions
     */
    upgradeALS(): void;
    /**
     * Solicita que o modelo de voz sendo utilizado pelo usuário atual para reconhecimento
     * seja atualizado para a versão mais recente.
     *
     * @see upgradeALS
     * @see checkForNewerVersions
     */
    upgradeVoiceModel(): void;
    /**
     * Faz uma verificação se existem upgrades disponíveis tanto para o ALS quanto
     * para o modelo de voz atualmente em uso. Emite os eventos `IaraEvent.NEWER_ALS_AVAILABLE`
     * e/ou `IaraEvent.NEWER_VOICE_MODEL_AVAILABLE` se houver algo novo disponível.
     *
     * É importante destacar que o reconhecedor da Iara já testa por versões novas
     * assim que é inicializado. Logo, esse método deve ser chamado pelo usuário apenas
     * se a aplicação estiver rodando por bastante tempo e existe, de fato, a necessidade
     * de uma nova checagem de versão.
     *
     * @see setDebug
     * @see debugLogGetAsHrefData
     */
    checkForNewerVersions(): void;
    /**
     * Inicia um novo laudo esperando opcionalmente um texto inicial
     * (por exemplo, o template carregado no laudo), um callback para quando o laudo é enviado
     * com sucesso para nossa API e retorna o identificador único do laudo
     * e
     *
     * @param type {String} (opcional) o texto inicial do laudo em html
     * @param type {function} (optional) o callback de sucesso
     *
     * @return {String} o identificador único do laudo
     *
     * @see IaraReport
     */
    beginReport(textObj?: {
        text: string;
        richText: string;
    } | string, callback?: (reportId: string) => void): string;
    /**
     * Finaliza o laudo atual, esperando o texto final e
     * um callback para quando o laudo é enviado com sucesso para nossa API
     *
     * @param type {String} o texto final do laudo em html
     * @param type {function} o callback de sucesso
     *
     * @see IaraReport
     */
    finishReport(textObj?: {
        text: string;
        richText: string;
    } | string, callback?: () => void): void;
    injectComponent(componentName: string, targetSelector: string, props?: Record<string, any>): void;
}

export declare interface IaraSpeechRecognitionContext<T> {
    addEventListener: (type: string, listener: (e?: CustomEvent) => void, options?: boolean | AddEventListenerOptions) => void;
    addPendingCallbackCall: (id: string, callback: () => void) => void;
    audioInputs: () => ALSAudioInputOutput[];
    audioOutputs: () => ALSAudioInputOutput[];
    alsChecker?: IaraALSChecker<T>;
    alsConnectors?: {
        recorder: IaraServiceConnector<T>;
        robot: IaraServiceConnector<T>;
        shortcuts: IaraServiceConnector<T>;
        speechmike: IaraServiceConnector<T>;
        updater: IaraServiceConnector<T>;
    };
    alsDisconnectedByForceConnection: boolean;
    asrManager?: IaraASRManager<T>;
    audioInputOutputTest: {
        active: boolean;
        dispatchEvents: boolean;
        onPlaybackCompleteCallback?: () => void;
        onRecordCompleteCallback?: () => void;
        shouldDispatchEvents: () => boolean;
    };
    availableInitParams: {
        apiToken: DefaultValue<string>;
        context: DefaultValue<string>;
        debug: DefaultValue<boolean>;
        engine: DefaultValue<IaraEngineTypes>;
        forceConnection: DefaultValue<boolean>;
        input: DefaultValue<string>;
        interimResults: DefaultValue<boolean>;
        lang: DefaultValue<string>;
        region: DefaultValue<IaraAPIRegions>;
        userId: DefaultValue<string>;
        useVAD: DefaultValue<boolean>;
    };
    debug: boolean;
    deviceManager?: IaraDeviceManager<T>;
    dispatchEventAndInternalHook: <T = unknown>(event: CustomEvent<T>, data?: any) => void;
    downloadingSpeechRecognitionEngine: boolean;
    downloadingVoiceModel: boolean;
    env: IaraEnvDetector;
    externalEditorCallbacks: {
        stopRecognitionCallback?: () => void;
    };
    externalEditorKeyboard?: IaraKeyboardLayouts;
    extractPendingCallbackCallById: (id: string) => {
        id: string;
        func: () => void;
    } | null;
    failed: boolean;
    getDeveloperMessageFromSdkErrorCode: (errorCode: number, complementaryMessage?: string | Event) => string;
    iaraAPI?: {
        sdk: {
            telemetry: IaraAPIConnector<T, unknown>;
            versions: {
                asr: IaraAPIConnector<T, IaraAPIAsr[]>;
                root: IaraAPIConnector<T, IaraAPISDKVersions[]>;
            };
        };
        users: {
            auth: {
                login: IaraAPIConnector<T, IaraAPILogin>;
                user: IaraAPIConnector<T, IaraAPIUser>;
            };
            feedbacks: IaraAPIConnector<T, IaraAPIFeedback>;
        };
        speech: {
            parameters: {
                current: IaraAPIConnector<T, IaraAPISpeechCurrent>;
            };
            parserRules: IaraAPIConnector<T, IaraAPIParserRules>;
            reports: IaraAPIConnector<T, IaraAPIReport>;
        };
    };
    iaraAPIMandatoryHeaders?: {
        [key: string]: string;
    };
    iaraAPIResponses: {
        asrVersions?: IaraAPIAsr[];
        key?: string;
        parameters?: IaraAPISpeechCurrent;
        sdkVersions?: IaraAPISDKVersions[];
        user?: IaraAPIUser;
    };
    iaraDataAPI?: {
        reports: IaraDataAPIConnector<T, unknown, IaraDataAPIXMLParams>;
        validations: IaraDataAPIConnector<T, IaraDataAPIValidations, Validation>;
    };
    iaraDataAPIValidationHeaders?: {
        [key: string]: string;
    };
    iaraAutomation: () => IaraAutomation<T>;
    iaraInit: () => void;
    iaraInitPerformed: boolean;
    initALSConnectors: () => void;
    initCallbacks: InitCallbacks;
    initCompletedDateTime: number;
    initFailed: boolean;
    initialized: boolean;
    initParams: InitParams;
    initReadinessRequiredHookScopes: InitReadinessRequiredHookScopes[];
    initReadinessRequiredHookScopesStatus: unknown;
    initStartedDateTime: number;
    interimResults: () => boolean;
    interimResultsPollingId: number;
    invokePendingCallback: (pendingCallbackObject: {
        id: string;
        func: () => void;
    }) => void;
    lastInterimResultTime: number;
    logger?: IaraLogger<T>;
    makeInitFail: (errorCode: number, developerMessageSuffix?: string, userMessageSuffix?: string) => void;
    mapAudioErrorCodeFromAlsRecorderToSdk: (errorCode: number, errorType: IaraEvent) => number;
    mapErrorCodeFromAlsRecorderToSdk: (errorCode: number, errorType: IaraEvent) => number;
    onalsoffline: (event?: CustomEvent<IaraEventDetail>) => void;
    onalsonline: (event?: CustomEvent<IaraEventDetail>) => void;
    onaudiodeviceadd: (event?: CustomEvent<IaraAudioDeviceDetail>) => void;
    onaudiodevicechange: (event?: CustomEvent<IaraAudioDeviceDetail>) => void;
    onaudiodeviceremove: (event?: CustomEvent<IaraAudioDeviceDetail>) => void;
    onaudiolevelupdate: (event?: CustomEvent<IaraAudioLevelUpdateDetail>) => void;
    onerror: (event?: CustomEvent) => void;
    onfetchrecording: (event?: string) => void;
    oninitdone: (event?: CustomEvent) => void;
    oninitfail: (event?: CustomEvent) => void;
    oninitprogress: (event?: CustomEvent<IaraInitDetail>) => void;
    onready: (event?: CustomEvent) => void;
    onresult: (event?: CustomEvent<IaraSpeechRecognitionDetail>) => void;
    onshortcut: (event?: CustomEvent<IaraShortcutDetail | IaraSpeechmikeButtonPressDetail>) => void;
    onstart: (event?: CustomEvent) => void;
    onstop: (event?: CustomEvent) => void;
    onHook: <T extends IaraEventDetail>(event: CustomEvent<T>, data: T) => void;
    pendingCallbackCalls: {
        id: string;
        func: () => void;
    }[];
    pendingInterimResultCounter: number;
    preventSendingInterimRequest: boolean;
    processInitStep: (endpoint: WebSocket, message: Message) => void;
    processInitStepIaraProgress: (specificType: IaraEvent, detailData?: number | string | {
        downloadUrl: string;
        version: string;
    }) => void;
    processOngoingMessages: (endpoint: WebSocket, message: Message) => void;
    ready: () => boolean;
    recognizing: boolean;
    recording: boolean;
    recordingDisabled: boolean;
    recordingDisabledReason?: string;
    recordingId?: string;
    recordingTimeLastStart: number;
    recordManager?: IaraRecordManager<T>;
    removeEventListener: (type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean) => void;
    setSpeechMikeLEDs: (buttons: SpeechMikeButton) => void;
    settings: {
        alsChecker: boolean;
        alsCheckPingInternalSec: number;
        alsCompatInitAddingEmailAndKey: boolean;
        alsDefaultSetTag: string;
        alsInstallInfo?: {
            downloadUrl: string;
            version: string;
        };
        automationEnabled: boolean;
        checkNewerALSOnStartup: boolean;
        checkNewerVoiceModelOnStartup: boolean;
        delayCheckNewVersionOnStartupMilli: number;
        delayEmitAlsOfflineEventMilli: number;
        downloadRecordingAsAudioFile: boolean;
        engine: IaraEngineSettings;
        externalEditor: {
            waitForFinalTranscript: boolean;
        };
        fallbackOnBrowserMicUnsupported: boolean;
        fetchRecordingData: boolean;
        holdInitBecauseBrowserMicPermissions: boolean;
        iaraApiSdkVersions?: IaraAPISDKVersions[];
        iaraInitAfterAlsWaitingResume: boolean;
        iaraInitOnlyIfUninitialized: boolean;
        ignoreBusyErrorDuringInit: boolean;
        initTimeoutSec: number;
        initWaitASRGetParamsSec: number;
        interimResultsPollingInternalIntervalMs: number;
        interimResultsPollingIntervalMs: number;
        interrupRecordingOnError: boolean;
        keepBacklog: boolean;
        microphone: Record<string, boolean>;
        minWaitTimeBetweenRecordingsMilli: number;
        minWaitTimeTooSoonToDoSomethingMilli: number;
        quickSpeechMikeEvents: boolean;
        recordManagerGetLinesInternalMilli: number;
        replaceCommandActivationStringBeforeCallback: boolean;
        robotDelay: number;
        setupBrowserMicrofoneForceSampleRate: boolean;
        telemetry: boolean;
        telemetryCollectMessages: boolean;
        telemetryItemIgnoreFilter: {
            [key: string]: RegExp;
        };
        telemetrySendBatchSize: number;
        telemetrySendIntervalMs: number;
        transcriptHistorySize: number;
        useExternalEditor: boolean;
        vad: {
            avgNoiseMultiplier: number;
            bufferLen: number;
            fftSize: number;
            maxCaptureFreq: number;
            maxNoiseLevel: number;
            minCaptureFreq: number;
            minNoiseLevel: number;
            noiseCaptureDuration: number;
            onVoiceStart?: (audioData?: Array<number>) => void;
            onVoiceStop?: () => void;
            smoothingTimeConstant: number;
            useVADForCommandActivation: boolean;
            useVADForTemplateActivation: boolean;
        };
        volumeEstimation: VolumeEstimation;
    };
    signalError: (errorCode: number, developerMessageSuffix?: string | Event, eventType?: IaraEvent) => void;
    stopInterimResultsPolling: () => void;
    stopRecordingOnNextInterim: boolean;
    engineSettingsPresets: Record<string, IaraEngineSettings>;
    telemetry?: IaraTelemetry<T>;
    ticker?: IaraTicker<T>;
    toggleRecording: () => void;
    tooSoonToDoSomethingLog: Record<string, number>;
    useVAD: () => boolean;
    setUseVAD: (value: boolean) => void;
    versionManager?: IaraVersionManager<T>;
    voiceModelDownloadCompleted: boolean;
}

export declare class IaraSpeechRecognitionDetail extends IaraEventDetail {
    type: IaraEvent;
    transcript: string;
    richTranscript: string;
    richTranscriptModifiers?: string[];
    richTranscriptWithoutModifiers?: string;
    rid?: string;
    inferenceId?: string;
    isFinal: boolean;
    isFirst: boolean;
    constructor(type: IaraEvent);
    toString(): string;
}

declare enum IaraStatus {
    CLASS_INITIALIZING = "",
    INITIALIZING = "Initializing",
    LOADING_IARA_ASR = "LoadingIaraASR",
    LOADING_KEY = "LoadingKey",
    LOADING_MODEL = "LoadingModel",
    READY = "Ready",
    UNINITIALIZED = "Uninitialized"
}

export declare class IaraSyncfusionAdapter extends EditorAdapter implements EditorAdapter {
    protected _recognition: IaraSpeechRecognition;
    config: IaraSyncfusionConfig;
    static IARA_API_URL: string;
    private readonly _assistantManager?;
    private readonly _contentManager;
    private _contentDate?;
    private _currentTemplatePlainText?;
    private _currentAssistantGeneratedReport?;
    private _cursorSelection?;
    private readonly _debouncedSaveReport;
    private readonly _documentEditor;
    private readonly _editorContainer?;
    private readonly _toolbarManager?;
    private readonly _languageManager;
    private readonly _inferenceBookmarksManager;
    private readonly _footerBarManager;
    private readonly _listeners;
    protected _navigationFieldManager: IaraSyncfusionNavigationFieldManager;
    protected static DefaultConfig: IaraSyncfusionConfig;
    protected _styleManager: IaraSyncfusionStyleManager;
    defaultFormat: CharacterFormatProperties;
    get contentManager(): IaraSyncfusionContentManager;
    get documentEditor(): DocumentEditor;
    set preprocessAndInsertTemplate(func: (template: unknown, metadata: unknown) => Promise<void>);
    constructor(_editorInstance: DocumentEditorContainer | DocumentEditor, _recognition: IaraSpeechRecognition, config?: IaraSyncfusionConfig);
    blockEditorWhileSpeaking(status: boolean): void;
    protected _handleRemovedNavigationField(): void;
    private _wrapElementWithLegacyStyles;
    private _preprocessClipboardHtml;
    private _convertDefaultColorToNoColor;
    private _findColoredTextInCurrentParagraph;
    copyReport(): Promise<string[]>;
    clearReport(): void;
    getEditorContent(): Promise<[string, string, string, string]>;
    insertText(text: string): void;
    insertInferenceText(text: string): void;
    insertParagraph(): void;
    insertTemplate(content: string, replaceAllContent?: boolean): Promise<void>;
    finishReport(): Promise<string[]>;
    hideSpinner(): void;
    insertInference(inference: IaraSpeechRecognitionDetail): void;
    moveToDocumentEnd(): void;
    undo(): void;
    private _saveReport;
    onTemplateSelectedAtShortCut(listViewInstance: ListView, dialogObj: Dialog): void;
    print(): void;
    replaceParagraph(sectionIndex: number, paragraphIndex: number, content: string): void;
    showSpinner(): void;
    private _setScrollClickHandler;
    protected _initCommands(): void;
}

declare class IaraSyncfusionAdditiveList {
    private _instance;
    private _list;
    private _fieldsSelected;
    constructor(_instance: IaraSyncfusionNavigationFieldManager);
    create: (additiveField: IaraAdditiveBookmark, additiveId: string) => void;
    addContent: (fieldSelected: string[], additiveField: IaraAdditiveBookmark) => void;
    customStyle: () => void;
    customPosition: () => void;
    customButton: (contextMenuElement: HTMLElement) => HTMLButtonElement;
    createItems: (additiveField: IaraAdditiveBookmark) => {
        text: string;
        value: string;
    }[];
    selectItem: (args: {
        data: {
            text: string;
            value: string;
        };
        isChecked: boolean;
    }, additiveId: string) => void;
    hide: () => void;
    show: (additiveField: IaraAdditiveBookmark, additiveId: string) => void;
}

export declare interface IaraSyncfusionConfig extends IaraEditorConfig {
    assistant: {
        enabled: boolean;
        impression: {
            itemizedOutput: boolean;
        };
        draggable?: {
            containerId: string;
            defaultPosition: {
                x: number;
                y: number;
            };
        };
        group_rules?: string | string[];
    };
    mouseButton: boolean;
    replaceToolbar: boolean;
    showBookmarks: boolean;
    showFinishReportButton: boolean;
}

export declare class IaraSyncfusionContentManager {
    reader: IaraSyncfusionContentReadManager;
    writer: IaraSyncfusionContentWriteManager;
    constructor(editor: DocumentEditor, inferenceBookmarksManager: IaraSyncfusionInferenceBookmarksManager, inferenceFormatter: IaraEditorInferenceFormatter, navigationFieldManager: IaraSyncfusionNavigationFieldManager, recognition: IaraSpeechRecognition, styleManager: IaraSyncfusionStyleManager, config: IaraSyncfusionConfig);
}

export declare class IaraSyncfusionContentReadManager {
    private _editor;
    private _isDirty;
    private _sfdt;
    constructor(_editor: DocumentEditor);
    fromContent(content: string): Promise<IaraSFDT>;
    fromEditor(): Promise<IaraSFDT>;
    getContent(sfdt?: IaraSFDT): Promise<[string, string, string, string]>;
    getHtmlContent(): Promise<string>;
    getPlainTextContent(): Promise<string>;
    getRtfContent(): Promise<string>;
    getSfdtContent(): Promise<IaraSFDT>;
    import(content: string, contentType?: IaraSyncfusionContentTypes): Promise<IaraSFDT>;
    private _getSfdtContent;
}

export declare enum IaraSyncfusionContentTypes {
    SFDT = "sfdt",
    HTML = "html",
    RTF = "rtf",
    PLAIN_TEXT = "plain_text"
}

export declare class IaraSyncfusionContentWriteManager {
    private _editor;
    private _inferenceBookmarksManager;
    private _inferenceFormatter;
    private _navigationFieldManager;
    private _readManager;
    private _recognition;
    private _styleManager;
    private _config;
    private _selectionManager?;
    preprocessAndInsertTemplate?: (template: unknown, metadata: unknown) => Promise<void>;
    selectedField: {
        content: string;
        title: string;
        type: "Field" | "Mandatory" | "Optional";
    };
    constructor(_editor: DocumentEditor, _inferenceBookmarksManager: IaraSyncfusionInferenceBookmarksManager, _inferenceFormatter: IaraEditorInferenceFormatter, _navigationFieldManager: IaraSyncfusionNavigationFieldManager, _readManager: IaraSyncfusionContentReadManager, _recognition: IaraSpeechRecognition, _styleManager: IaraSyncfusionStyleManager, _config: IaraSyncfusionConfig);
    private _formatSectionTitle;
    private _handleFirstInference;
    private _handleTemplateOrPhraseInference;
    private _updateSelectedNavigationField;
    insertParagraph(): void;
    insertTemplate(content: string, replaceAllContent: boolean): Promise<void>;
    clear(): void;
    insertText(text: string): void;
    insertInferenceText(text: string): void;
    formatSectionTitles(): void;
    formatTitle(): void;
    insertInference(inference: IaraSpeechRecognitionDetail): void;
}

export declare class IaraSyncfusionContextMenuManager {
    private _editor;
    private _navigationFieldManager;
    private _languageManager;
    constructor(_editor: DocumentEditor, _navigationFieldManager: IaraSyncfusionNavigationFieldManager, _languageManager: IaraSyncfusionLanguageManager);
}

export declare class IaraSyncfusionFooterBarManager {
    private _languageManager;
    private _config;
    private _onFinishReportClick;
    private _finishReportButton;
    private _statusBarElement;
    private _savingReportSpan;
    constructor(_languageManager: IaraSyncfusionLanguageManager, _config: IaraSyncfusionConfig, _onFinishReportClick: () => void);
    private _initSavingReportSpan;
    private _initFinishReportSpan;
    updateSavingReportStatus(status: "success" | "error" | "loading"): void;
}

export declare class IaraSyncfusionInferenceBookmarksManager {
    private readonly _documentEditor;
    private readonly _recognition;
    private _bookmarks;
    get bookmarks(): Record<string, IaraInferenceBookmark>;
    private readonly _listeners;
    constructor(_documentEditor: DocumentEditor, _recognition: IaraSpeechRecognition);
    private _initListeners;
    private _updateBookmarkContent;
    destroy(): void;
    clearBookmarks(): void;
    addBookmark(inference: IaraSpeechRecognitionDetail, bookmarkId?: string): string;
    updateBookmarks(): void;
    updateBookmarkInference(bookmarkName: string, inference: IaraSpeechRecognitionDetail): void;
}

export declare class IaraSyncfusionLanguageManager {
    private _config;
    languages: IaraLanguages;
    constructor(_config: IaraSyncfusionConfig);
}

export declare class IaraSyncfusionNavigationFieldManager extends IaraEditorNavigationFieldManager {
    _documentEditor: DocumentEditor;
    private readonly _config;
    private readonly _languageManager;
    additiveListIntance: IaraSyncfusionAdditiveList | null;
    additiveIdList: string[];
    additiveBookmark: IaraAdditiveBookmark;
    blockSelectionInBookmarkCreate: boolean;
    bookmarks: IaraNavigationBookmark[];
    currentSelectionOffset: {
        start: string;
        end: string;
    };
    insertedBookmark: IaraNavigationBookmark;
    isFirstNextNavigation: boolean;
    isFirstPreviousNavigation: boolean;
    nextBookmark: IaraNavigationBookmark;
    previousBookmark: IaraNavigationBookmark;
    private _previousBookmarksTitles;
    private readonly _listeners;
    constructor(_documentEditor: DocumentEditor, _config: IaraSyncfusionConfig, _recognition: IaraSpeechRecognition, _languageManager: IaraSyncfusionLanguageManager);
    addAdditiveField(): void;
    createBookmarks(setColor?: boolean): void;
    destroy(): void;
    insertAdditiveField(additive: IaraAdditiveBookmark): void;
    insertField(content?: string, title?: string, type?: "Field" | "Mandatory" | "Optional"): void;
    goToField(title: string): void | string;
    nextField(isShortcutNavigation?: boolean): void;
    previousField(isShortcutNavigation?: boolean): void;
    selectContent(title: string, content: string, bookmarkName: string): void;
    selectTitle(title: string, bookmarkName: string, selectAllTitle?: boolean): void;
    sortByPosition(): void;
    getTitleAndContent(bookmarkContent: string): {
        title: string;
        content: string;
    };
    popAndUpdate(bookmarkName: string, content: string, title: string): void;
    setColor(): void;
    updateBookmark(editorBookmarks: string[]): void;
    removeEmptyField(editorBookmarks: string[]): void;
    getPreviousAndNext(currentOffset: {
        start: string;
        end: string;
    }): void;
    findCurrentIndex(bookmark: {
        start: string;
        end: string;
    }, currentOffset: {
        start: string;
        end: string;
    }): number;
    checkIsSelectedAndUpdatePrevious(previousIndex: number): IaraNavigationBookmark;
    clearReportToCopyContent(): void;
    hasEmptyRequiredFields(): boolean;
    sectionAdditiveField: () => void;
    selectBookmark(bookmarkId: string, excludeBookmarkStartEnd?: boolean): void;
    selectionChange: () => void;
    showAdditiveList(): void;
}

export declare class IaraSyncfusionSelectionManager {
    private _editor;
    private _config;
    initialSelectionData: SelectionData;
    wordAfterSelection: string;
    wordBeforeSelection: string;
    isAtStartOfLine: boolean;
    constructor(_editor: DocumentEditor, _config: IaraSyncfusionConfig, bookmarkId?: string, highlightSelection?: boolean);
    private _isValidOffsetDistance;
    private _getWordAfterSelection;
    private _getWordBeforeSelection;
    private _highlightSelection;
    destroy(): void;
    resetSelection(resetStyles?: boolean): void;
    moveSelectionToAfterBookmarkEdge(bookmarkId: string): void;
    moveSelectionToBeforeBookmarkEdge(bookmarkId: string): void;
    static copyStyles(characterFormat: SelectionCharacterFormatData): SelectionCharacterFormatData;
    static resetStyles(documentEditor: DocumentEditor, characterFormat: SelectionCharacterFormatData): void;
    resetStyles(): void;
    selectBookmark(bookmarkId: string, excludeBookmarkStartEnd?: boolean): void;
    static selectBookmark(documentEditor: DocumentEditor, bookmarkId: string, excludeBookmarkStartEnd?: boolean): void;
}

export declare class IaraSyncfusionShortcutsManager {
    private _editor;
    private _recognition;
    private _contentManager;
    private _config;
    private _navigationFieldManager;
    private onTemplateSelected;
    constructor(_editor: DocumentEditor, _recognition: IaraSpeechRecognition, _contentManager: IaraSyncfusionContentManager, _config: IaraSyncfusionConfig, _navigationFieldManager: IaraSyncfusionNavigationFieldManager, onTemplateSelected: (listViewInstance: ListView, dialogObj: Dialog) => void);
    onKeyDown(args: DocumentEditorKeyDownEventArgs): void;
    shortcutByAt(args: DocumentEditorKeyDownEventArgs): void;
    shortcutByTabAndShiftTab(args: DocumentEditorKeyDownEventArgs): void;
    onSlashShortcut(args: DocumentEditorKeyDownEventArgs): Promise<void>;
}

export declare class IaraSyncfusionStyleManager extends IaraEditorStyleManager {
    private _editor;
    private _config;
    zoomInterval: ReturnType<typeof setTimeout> | null;
    constructor(_editor: DocumentEditor, _config: IaraSyncfusionConfig);
    setEditorDefaultFont(font?: Font): void;
    setEditorDefaultLineSpacing(): void;
    setEditorFontColor(color: string): void;
    setSelectionFontFamily(fontFamily: string): void;
    setSelectionFontSize(fontSize: number): void;
    setSelectionParagraphSpacingFormat: (paragraphSpacing: {
        after: number;
        before: number;
    }) => void;
    setTheme(theme: "light" | "dark"): void;
    setZoomFactor(zoomFactor: string): void;
    static loadThemeCss(theme: "light" | "dark"): void;
    toggleBold(): void;
    toggleItalic(): void;
    toggleList(): void;
    toggleNumberedList(): void;
    toggleUnderline(): void;
    toggleUppercase(): void;
}

export declare class IaraSyncfusionToolbarManager {
    private _editorContainer;
    private _config;
    private _navigationFieldManager;
    private _languageManager;
    private readonly _listeners;
    constructor(_editorContainer: DocumentEditorContainer, _config: IaraSyncfusionConfig, _navigationFieldManager: IaraSyncfusionNavigationFieldManager, _languageManager: IaraSyncfusionLanguageManager);
    init(): void;
    destroy(): void;
    private _removePropertiesPane;
    private _addRibbonToolbar;
    ribbonItensLayout(layout: string): void;
    private _setupTrackChangesTab;
}

declare class IaraTelemetry<T> {
    private _iaraContext;
    private _queue;
    constructor(_iaraContext: IaraSpeechRecognitionContext<T>);
    /**
     *
     */
    private _init;
    /**
     *
     */
    tick(): void;
    private _sendQueueToAPI;
    /**
     * Invocado quando qualquer de javascript acontece no browser, seja no SDK ou em qualquer
     * outra biblioteca rodando.
     */
    private _onGlobalError;
    /**
     * Invocado antes que qualquer hook do sistema seja processado.
     */
    beforeProcessHook(event: any, data: any): void;
    /**
     * Invocado depois que todos os outros hooks do sistema foram processados.
     */
    processHook(event: any, data: any): void;
    private _digestItem;
    private _collectItem;
    private _shouldIgnoreItem;
}

declare class IaraTicker<T> {
    /**
     * Reference to the Iara namespace.
     *
     * @ignore
     */
    private _iaraContext;
    private _intervalMilliseconds;
    private _entries;
    private _intervalId;
    constructor(
    /**
     * Reference to the Iara namespace.
     *
     * @ignore
     */
    _iaraContext: IaraSpeechRecognitionContext<T>, _intervalMilliseconds: number);
    add(callback: () => void, intervalMilliseconds: number, callbackContext: IaraALSChecker<T> | IaraRecordManager<T> | T | IaraTelemetry<T>): void;
    shouldCallEntry(entry: IaraTickerEntry<T>, timeNow: number): boolean;
    update(): void;
    destroy(): void;
    init(intervalMilli: number): void;
}

export declare interface IaraTickerEntry<T> {
    callback: () => void;
    context: IaraALSChecker<T> | IaraRecordManager<T> | T | IaraTelemetry<T>;
    intervalMS: number;
    timeLastCall: number;
}

export declare class IaraTinyMCEAdapter extends EditorAdapter implements EditorAdapter {
    protected _editor: Editor;
    protected _recognition: IaraSpeechRecognition;
    config: IaraEditorConfig;
    protected _styleManager: IaraTinyMceStyleManager;
    protected _navigationFieldManager: IaraTinyMceNavigationFieldManager;
    private _initialUndoStackSize;
    constructor(_editor: Editor, _recognition: IaraSpeechRecognition, config: IaraEditorConfig);
    protected _handleRemovedNavigationField(): void;
    getUndoStackSize(): number;
    getEditorContent(): Promise<[string, string, string]>;
    insertInference(inference: IaraSpeechRecognitionDetail): void;
    insertParagraph(): void;
    insertText(text: string): void;
    blockEditorWhileSpeaking(status: boolean): void;
    undo(): void;
    copyReport(): Promise<string[]>;
    clearReport(): void;
    print(): void;
    nextField(): void;
    previousField(): void;
    goToField(title: string): void;
    hasEmptyRequiredFields(): boolean;
    insertField(): void;
    aditiveBookmark: {};
}

declare class IaraTinyMceNavigationFieldManager extends IaraEditorNavigationFieldManager {
    additiveBookmark: IaraAdditiveBookmark;
    nextField(): void;
    previousField(): void;
    goToField(title: string): void;
    hasEmptyRequiredFields(): boolean;
    insertField(): void;
}

declare class IaraTinyMceStyleManager extends IaraEditorStyleManager {
    setSelectionFontFamily(_fontName: string): void;
    setSelectionFontSize(_fontSize: number): void;
    setSelectionParagraphSpacingFormat(_paragraphSpacing: {
        after: number;
        before: number;
    }): void;
    setEditorFontColor(_fontColor: string): void;
    toggleBold(): void;
    toggleItalic(): void;
    toggleList(): void;
    toggleNumberedList(): void;
    toggleUnderline(): void;
    toggleUppercase(): void;
}

declare class IaraVersionManager<T> {
    private _iaraContext;
    private _LOG_PREFIX;
    constructor(_iaraContext: IaraSpeechRecognitionContext<T>);
    processHook(event: any, data: any): void;
    private _getMostRecentALSVersionInformedByAPI;
    processEndpointMessage(endpoint: WebSocket, message: IaraVersionMessage): void;
    private _handleInstalledALSVersionCheck;
    private _failIfInstalledALSVersionIsNotCompatible;
    private _handleVoiceModelUpdateCheck;
    private _handleVoiceModelDownloadProgress;
    private _handleALSUpdateCheck;
    private _dispatchEventIfNewerAlsVersionAvailable;
    private _checkVoiceModelUpdateAvailable;
    private _checkALSUpdateAvailable;
    checkForNewerVersions(): void;
    private _getInstalledALSVersion;
    performALSUpdate(): void;
    performVoiceModelUpdate(): void;
}

export declare interface IaraVersionMessage {
    availableVersion?: string;
    currentVersion?: string;
    iaraDownloadProgress?: number;
    iaraUpdateAvailable?: boolean;
    identifier?: string;
    updaterError?: string;
    version?: string;
}

export declare interface IBrowserOrOS {
    name: string;
    version: string;
}

export declare interface ICustomWebSocket<T, P> extends WebSocket {
    iaraContext?: IaraSpeechRecognitionContext<T>;
    self?: P;
}

export declare interface InitCallbacks {
    done?: (e?: CustomEvent) => void;
    fail?: (e?: CustomEvent) => void;
    progress?: (e?: CustomEvent) => void;
}

export declare interface InitParams {
    apiToken?: string;
    context?: string;
    debug?: boolean;
    engine?: IaraEngineTypes;
    forceConnection?: boolean;
    input?: string;
    interimResults?: boolean;
    lang?: string;
    region?: IaraAPIRegions;
    userId?: string;
    useVAD?: boolean;
}

declare enum InitReadinessRequiredHookScopes {
    ASRMANAGER_ASR_PARSER_RULES_LOADED = "asrmanager.asrparserrulesloaded",
    ASRMANAGER_MODEL_AND_ASR_LOADED = "asrmanager.modelandasrloaded",
    ASRMANAGER_PARAMS_MATCH = "asrmanager.paramsmatch",
    ASRMANAGER_PARAMS_MISMATCH = "asrmanager.paramsmismatch",
    ASRMANAGER_PARSER_RULES_LOADED = "asrmanager.parserrulesloaded",
    INIT_INPUT_OK = "initinputok"
}

export declare interface InitStructure {
    done?: (doneCallback: (e?: CustomEvent) => void) => InitStructure;
    fail?: (failCallback: (e?: CustomEvent) => void) => InitStructure;
    progress?: (progressCallback: (e?: CustomEvent) => void) => InitStructure;
}

export declare interface InputOrOutput {
    [key: string]: {
        id: string;
        selected: boolean;
        name: string;
        group: string;
        device?: IaraMediaDeviceInfo;
    };
}

export declare interface KeyboardMessage {
    alt?: boolean;
    control?: boolean;
    debug?: string;
    keyCode?: number;
    shift?: boolean;
    shortcutsError?: string;
}

export declare interface LinesInfo {
    inputList: InputOrOutput;
    outputList: InputOrOutput;
    informer?: "browser" | "als";
}

export declare interface Message<T = Record<string, unknown>> extends KeyboardMessage, IaraASRMessage, IaraInferenceMessage, IaraParserRulesMessage, IaraRecorderMessage, IaraRobotMessage, IaraVersionMessage {
    audio?: string;
    audioFormat?: string;
    base64?: string;
    commandList?: (string | number)[][];
    content?: string;
    data?: string | T;
    disconnected?: string;
    disableSpeechRecognition?: boolean;
    iaraStatus?: IaraStatus;
    line?: unknown;
    oggFileExported?: string;
    position?: number;
    reportUUID?: string;
    sampleRate?: ConstrainULong;
    shortcutsError?: string;
    status?: string;
    tag?: string;
    task?: string;
    trainingUUID?: string;
    transcript?: string;
    translations?: string;
    volume?: number;
}

declare enum OnPropertyChanged {
    DEVICE_IN_USE = "deviceInUse",
    DEVICE_OPENED = "deviceOpened"
}

export declare interface ParserRule {
    direction: string;
    id: number;
    is_regex: boolean;
    priority: number;
    source: string;
    target: string;
    type: ParserRuleTypes;
}

declare enum ParserRuleDirection {
    BIDIRECTIONAL = "bidirectional",
    POST_PROCESSING = "post_processing",
    PRE_PROCESSING = "pre_processing"
}

export declare interface ParserRules {
    groupRules: ParserRule[];
    defaultRules: ParserRule[];
    userRules: ParserRule[];
}

declare enum ParserRuleTypes {
    ACRONYM = "Acronym",
    AGGLUTINATION = "Agglutination",
    COMPOUND_WORD = "Compound Word",
    CONTRACTION = "Contraction",
    HYPHENATION = "Hyphenation",
    NUMBERS = "Numbers",
    ORDINAL_NUMBERS = "Ordinal Numbers",
    PERSONAL = "Personal",
    PROPER_NOUM = "Proper Noun",
    PUNCTUATION = "Punctuation",
    REFLEXIVE_PRONOUM = "Reflexive Pronoun",
    SPECIAL_CASES = "Special Cases"
}

declare enum RecordingEngine {
    ALS_RECORDING = "alsRecording",
    BROWSER_RECORDING = "browserRecording"
}

export declare type Ribbon = {
    displayMode?: "Classic" | "Simplified";
    collections?: {
        logo?: "logo"[][] | boolean;
        file?: ("open" | "undo" | "redo")[][] | boolean;
        insert?: ("image" | "table")[][] | boolean;
        clipboard?: ("copy" | "cut" | "paste")[][] | boolean;
        font?: ("fontFamily" | "fontSize" | "fontColor" | "bold" | "italic" | "underline" | "strikeThrough")[][] | boolean;
        paragraph?: ("decreaseIdent" | "increaseIdent" | "lineSpacing" | "bullets" | "numbering" | "paragraphMark" | "alignment")[][] | boolean;
        navigation?: "navigationField"[][] | boolean;
        documentReview?: "trackchanges"[][] | boolean;
        export?: "exportPdf"[][] | boolean;
    };
};

export declare type RibbonCollection = "logo" | "file" | "insert" | "clipboard" | "font" | "paragraph" | "navigation" | "export" | "documentReview";

export declare type RibbonCustomItems = "logo"[][] | ("open" | "undo" | "redo")[][] | ("image" | "table")[][] | ("copy" | "cut" | "paste")[][] | ("fontFamily" | "fontSize" | "fontColor" | "bold" | "italic" | "underline" | "strikeThrough")[][] | ("decreaseIdent" | "increaseIdent" | "lineSpacing" | "bullets" | "numbering" | "paragraphMark" | "alignment")[][] | "navigationField"[][] | "trackchanges"[][] | "exportPdf"[][];

export declare interface RibbonFontMethods {
    changeFontFamily: (args: {
        value: string;
    }, ribbon?: Ribbon_2) => void;
    changeFontSize: (args: {
        value: number;
    }, ribbon?: Ribbon_2) => void;
    changeFontColor: (args: {
        currentValue: {
            hex: string;
        };
    }, ribbon?: Ribbon_2) => void;
}

export declare interface RibbonParagraphMethods {
    changeLineSpacing: (args: {
        value: number;
    }, ribbon?: Ribbon_2) => void;
}

declare interface SelectionCharacterFormatData {
    allCaps: boolean;
    baselineAlignment: BaselineAlignment;
    bold: boolean;
    fontColor: string;
    fontFamily: string;
    fontSize: number;
    highlightColor: HighlightColor;
    italic: boolean;
    strikethrough: Strikethrough;
    underline: Underline;
}

declare interface SelectionData {
    bookmarkId: string;
    characterFormat: SelectionCharacterFormatData;
}

export declare type SpeechFile = {
    id: number;
    created_at: string;
    file_obj: string;
    modified_at: string;
};

export declare interface SpeechMikeButton {
    [SpeechMikeButtonTypes.EOL_GREEN]?: SpeechMikeLedState;
    [SpeechMikeButtonTypes.EOL_RED]?: SpeechMikeLedState;
    [SpeechMikeButtonTypes.F1]?: SpeechMikeLedState;
    [SpeechMikeButtonTypes.F2]?: SpeechMikeLedState;
    [SpeechMikeButtonTypes.F3]?: SpeechMikeLedState;
    [SpeechMikeButtonTypes.F4]?: SpeechMikeLedState;
    [SpeechMikeButtonTypes.INSERT_GREEN]?: SpeechMikeLedState;
    [SpeechMikeButtonTypes.INSERT_RED]?: SpeechMikeLedState;
    [SpeechMikeButtonTypes.TOP_GREEN]?: SpeechMikeLedState;
    [SpeechMikeButtonTypes.TOP_RED]?: SpeechMikeLedState;
}

declare enum SpeechMikeButtons {
    EOL = "buttonEOL",
    F1 = "buttonFunctionKey1",
    F2 = "buttonFunctionKey2",
    F3 = "buttonFunctionKey3",
    F4 = "buttonFunctionKey4",
    FORWARD = "buttonForward",
    INS = "buttonInsert",
    RECORD = "buttonRecord",
    REWIND = "buttonRewind"
}

declare enum SpeechMikeButtonTypes {
    EOL_GREEN = "eolGreen",
    EOL_RED = "eolRed",
    F1 = "f1",
    F2 = "f2",
    F3 = "f3",
    F4 = "f4",
    INSERT_GREEN = "insertGreen",
    INSERT_RED = "insertRed",
    TOP_GREEN = "topGreen",
    TOP_RED = "topRed"
}

declare enum SpeechMikeLedState {
    FAST = "FAST",
    OFF = "OFF",
    SLOW = "SLOW",
    SOLID = "SOLID"
}

export declare interface SpeechMikeMessage {
    newValue: boolean;
    oldValue: boolean;
    onPropertyChanged: SpeechMikeButtons | OnPropertyChanged;
}

declare enum StateTypes {
    STATE_UNKNOWN = "iaraALSCheckerStateUnknown",
    STATE_CHECKING = "iaraALSCheckerStateChecking",
    STATE_INIT_WAITING_ALS_INSTALL = "iaraALSCheckerStateInitWaitingInstall",
    STATE_WAITING_ALS_RESUME = "iaraALSCheckerStateWaitingResume",
    STATE_ALS_UP = "iaraALSCheckerStateUp"
}

export declare const tabsConfig: (editor: DocumentEditorContainer, toolbarOpenFile: (arg: string, editor: DocumentEditorContainer) => void, toolbarButtonClick: (arg: string, editor: DocumentEditorContainer, config?: IaraSyncfusionConfig, navigationFields?: IaraSyncfusionNavigationFieldManager) => void, editorContainerLocale: IaraLanguages, config: IaraSyncfusionConfig, ribbonMethods: {
    ribbonFontMethods: (editor: DocumentEditorContainer) => RibbonFontMethods;
    ribbonParagraphMethods: (editor: DocumentEditorContainer) => RibbonParagraphMethods;
}, navigationFunc: (funcId: string) => void) => RibbonTabModel[];

export declare interface Template {
    key: string;
    findText: string;
    replaceText: string;
    originalRichTranscript: string;
    config?: TemplateConfig;
    callback: TemplateCallback<void>;
    metadata: unknown;
    callbackThis?: any;
}

export declare type TemplateCallback<T> = (resultEvent: CustomEvent<IaraSpeechRecognitionDetail>, templateContext: Template, config: Record<string, unknown>) => T;

export declare interface TemplateConfig {
    templateFunction: TemplateCallback<boolean>;
    [key: string]: unknown;
}

export declare const toolBarSettings: (editor: DocumentEditorContainer, navigationFields: IaraSyncfusionNavigationFieldManager, editorContainerLocale: IaraLanguages, config: IaraSyncfusionConfig) => {
    ribbon: Ribbon_2;
    listener: () => void;
};

export declare interface Validation {
    evaluation: number;
    profile_id: string | number;
    recording_id: string | number;
}

export declare interface VolumeEstimation {
    enable: boolean;
    measure: string;
    decimalPlaces: number;
}

export { }


declare global {
    interface Clipboard extends EventTarget {
        read(): Promise<ClipboardItem[]>;
        readText(): Promise<string>;
        write(data: ClipboardItem[]): Promise<void>;
        writeText(data: string): Promise<void>;
    }
}

