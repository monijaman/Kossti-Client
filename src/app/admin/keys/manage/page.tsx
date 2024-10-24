'use client'
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateSpecification() {
    const [productId, setProductId] = useState('');
    const [specificationKeyId, setSpecificationKeyId] = useState('');
    const [value, setValue] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/specifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: productId,
                specification_key_id: specificationKeyId,
                value: value,
            }),
        });

        if (res.ok) {
            router.push('/specifications'); // Redirect to the list page
        }
    };

    return (
        <div>
            <h1>Create a New Specification</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Product ID</label>
                    <input type="text" value={productId} onChange={(e) => setProductId(e.target.value)} required />
                </div>
                <div>
                    <label>Specification Key ID</label>
                    <input type="text" value={specificationKeyId} onChange={(e) => setSpecificationKeyId(e.target.value)} required />
                </div>
                <div>
                    <label>Value</label>
                    <input type="text" value={value} onChange={(e) => setValue(e.target.value)} required />
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}
