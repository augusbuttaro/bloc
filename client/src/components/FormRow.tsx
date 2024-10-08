import { Label } from "./ui/label"
import { Input } from "./ui/input"

function FormRow({ type, name, labelText, autoComplete, onChange, defaultValue, className, placeholder, onSubmit }
     : { type:string,  onSubmit?: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?:string, name:string, labelText:string, autoComplete?:string, className?:string, defaultValue?:string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void  }){
    return(
        <div className="flex flex-col">
            {labelText? (<Label className="mt-4 mb-2">
                {labelText}
            </Label>): null}
            <Input
                type={type}
                id={name}
                name={name}
                required
                className={className}
                autoComplete={autoComplete}
                onChange={onChange}
                onSubmit={onSubmit}
                defaultValue={defaultValue}
                placeholder={placeholder}
            />
        </div>
    )
}

export default FormRow