import styles from './authInput.module.scss'
import { ChangeEventHandler, InputHTMLAttributes } from 'react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
	value: string
	onChange: ChangeEventHandler<HTMLInputElement> | undefined
	id?: string
	//Checks if an error message should be displayed
	hasError: boolean
	errorText: string
}

export function AuthInput(props: AuthInputProps) {
	return (
		<>
			<input
				id={props.id}
				type={props.type}
				placeholder={props.placeholder}
				maxLength={props.maxLength}
				value={props.value}
				onChange={props.onChange}
				className={props.className}
			/>
			{props.hasError && <span className={styles.errorText}>{props.errorText}</span>}
		</>
	)
}
