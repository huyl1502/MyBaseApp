import {
    createContext,
    type ReactNode,
    type RefObject,
    useRef,
} from "react";

export interface ValidatorRef {
    validate: () => Promise<boolean>;
}

export interface ValidatorContextType {
    register: (
        ref: RefObject<ValidatorRef | null>,
        group?: string
    ) => void;

    unregister: (
        ref: RefObject<ValidatorRef | null>
    ) => void;

    validateAll: () => Promise<boolean>;

    validateGroup: (
        groupName: string
    ) => Promise<boolean>;

    validateGroups: (
        groupNames: string[]
    ) => Promise<boolean>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ValidatorContext =
    createContext<ValidatorContextType>({
        register: () => { },
        unregister: () => { },
        validateAll: async () => true,
        validateGroup: async () => true,
        validateGroups: async () => true,
    });

interface ValidatorProviderProps {
    children: ReactNode;
}

export const ValidatorProvider = ({
    children,
}: ValidatorProviderProps) => {
    const validatorsRef = useRef(
        new Map<
            RefObject<ValidatorRef | null>,
            string | undefined
        >()
    );

    const register = (
        ref: RefObject<ValidatorRef | null>,
        group?: string
    ) => {
        const exists = validatorsRef.current.has(ref);

        if (!exists) {
            validatorsRef.current.set(ref, group);
        }
    };

    const unregister = (
        ref: RefObject<ValidatorRef | null>
    ) => {
        validatorsRef.current.delete(ref);
    };

    const validateAll = async () => {
        const results = await Promise.all(
            [...validatorsRef.current.entries()].map(
                ([ref]) => ref.current?.validate()
            )
        );

        return results.every((res) => res === true);
    };

    const validateGroup = async (
        groupName: string
    ) => {
        const groupValidators =
            [...validatorsRef.current.entries()].filter(
                ([, g]) => g === groupName
            );

        const results = await Promise.all(
            groupValidators.map(([ref]) =>
                ref.current?.validate()
            )
        );

        return results.every((res) => res === true);
    };

    const validateGroups = async (
        groupNames: string[]
    ) => {
        const groupValidators =
            [...validatorsRef.current.entries()].filter(
                ([, g]) =>
                    g !== undefined && groupNames.includes(g)
            );

        const results = await Promise.all(
            groupValidators.map(([ref]) =>
                ref.current?.validate()
            )
        );

        return results.every((res) => res === true);
    };

    return (
        <ValidatorContext.Provider
            value={{
                register,
                unregister,
                validateAll,
                validateGroup,
                validateGroups,
            }}
        >
            {children}
        </ValidatorContext.Provider>
    );
};