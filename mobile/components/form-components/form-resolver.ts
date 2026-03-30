import { FieldError, FieldErrors, FieldValues, ResolverResult } from 'react-hook-form';
import { z } from 'zod';

/**
 * A custom React Hook Form resolver that validates form values against a Zod schema.
 *
 * React Hook Form's `resolver` option accepts a function that takes the current
 * form values and returns either the validated data or a map of field errors.
 * This helper bridges Zod's `safeParse` result to that format.
 *
 * **Why a custom resolver instead of `@hookform/resolvers/zod`?**
 * This implementation gives us direct control over how Zod issues are mapped
 * to field paths, which is useful when you want to customise error formatting
 * or handle root-level errors (e.g. from a `.refine()` that spans multiple fields).
 *
 * @param schema - Any Zod schema that describes the form's data shape.
 * @returns A resolver function compatible with `useForm({ resolver })`.
 *
 * @example
 * const schema = z.object({ email: z.string().email() });
 * const form = useForm({ resolver: formResolver(schema) });
 */
export const formResolver =
  <T extends FieldValues>(schema: z.ZodSchema<any>) =>
  (values: T): ResolverResult<T> => {
    const result = schema.safeParse(values);

    // Validation passed — return the parsed (possibly transformed) data
    if (result.success) {
      return {
        values: result.data,
        errors: {},
      };
    }

    const fieldErrors: FieldErrors<T> = {};

    // Map each Zod issue to the corresponding field path.
    // `issue.path` is an array like ['address', 'zip'] — join it to get 'address.zip'.
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');

      if (path) {
        // Field-level error (the most common case)
        const fieldError: FieldError = {
          type: 'validation',
          message: issue.message,
        };

        fieldErrors[path as keyof T] = fieldError as FieldErrors<T>[keyof T];
      } else {
        // Root-level error — produced by top-level `.refine()` or `.superRefine()`
        const rootError: FieldError = {
          type: 'validation',
          message: issue.message,
        };

        fieldErrors['root' as keyof T] = rootError as FieldErrors<T>[keyof T];
      }
    });

    return {
      values: {},
      errors: fieldErrors,
    };
  };
