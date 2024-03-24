import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import cls from './ColorInfo.module.scss';

interface FileWithPreview extends File {
    preview: string;
}

interface Props {
    color: string;
    setColor: React.Dispatch<React.SetStateAction<string>>;
    files: FileWithPreview[];
    setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
}

const ColorInfo = ({ color, setColor, files, setFiles }: Props) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFilesWithPreview = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })) as FileWithPreview[];
        setFiles((prev: FileWithPreview[]) => [...prev, ...newFilesWithPreview]);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleDeleteFile = useCallback((index: number) => {
        setFiles((prev: FileWithPreview[]) => prev.filter((_, i) => i !== index));
    }, []);

    return (
        <div className={cls.colorInfo}>
            <div className={cls.colorPicker}>
                <label htmlFor="colorInput">Alege culoarea:</label>
                <input
                    id="colorInput"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className={cls.colorInput}
                />
            </div>
            <div {...getRootProps({ className: cls.dragDropArea })}>
                <input {...getInputProps()} className={cls.fileInput} />
                <p>Trageți și plasați fișierele aici sau faceți clic pentru a selecta fișiere</p>
            </div>
            <ul className={cls.fileList}>
                {files.map((file, index) => (
                    <li key={index}>
                        <span>{file.name}</span>
                        <button onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteFile(index)
                        }} className={cls.deleteButton}>Șterge</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ColorInfo;
