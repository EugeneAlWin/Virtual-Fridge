import { ChangeEventHandler, ReactNode } from 'react'
import styles from './searchInput.module.scss'

interface SearchInputProps {
	search: string
	onChange: ChangeEventHandler<HTMLInputElement> | undefined
	children?: ReactNode
}

export function SearchInput({ search, onChange, children }: SearchInputProps) {
	return (
		<div className={styles.container}>
			<div>
				<p className={styles.text}>Искать</p>
				<input
					className={styles.input}
					type='text'
					value={search}
					onChange={onChange}
				/>
			</div>
			<div>{children}</div>
		</div>
	)
}
