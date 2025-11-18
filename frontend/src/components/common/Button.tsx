import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "outline";
	size?: "sm" | "md" | "lg";
	isLoading?: boolean;
	children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
	variant = "primary",
	size = "md",
	isLoading = false,
	disabled,
	children,
	className = "",
	...props
}) => {
	const baseStyles =
		"font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

	const variants = {
		primary:
			"bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-gray-300",
		secondary:
			"bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300",
		outline:
			"border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 disabled:border-gray-300 disabled:text-gray-300",
	};

	const sizes = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-6 py-2.5 text-base",
		lg: "px-8 py-3 text-lg",
	};

	return (
		<button
			className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
        ${isLoading || disabled ? "cursor-not-allowed opacity-60" : ""}
      `}
			disabled={isLoading || disabled}
			{...props}
		>
			{isLoading ? (
				<span className="flex items-center gap-2">
					<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
							fill="none"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
					Processing...
				</span>
			) : (
				children
			)}
		</button>
	);
};

export default Button;
