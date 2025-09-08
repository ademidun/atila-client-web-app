import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Form, Select } from 'antd';
import { connect } from 'react-redux'
import { Wallet } from '../../models/Wallet.class'
import Loading from '../Loading';
import { getErrorMessage } from '../../services/utils';
import { useNavigate } from 'react-router-dom';
import ConnectWallet from './ConnectWallet';

const { Option } = Select;

interface LinkContentToWalletProps {
    userProfileLoggedIn: any;
    content?: any;
    contentType?: string;
    onContentLinked?: (wallet: Wallet) => void;
}

function LinkContentToWallet({ userProfileLoggedIn, onContentLinked }: LinkContentToWalletProps) {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [wallets, setWallets] = useState<Array<Wallet>>([]);
    const [error, setError] = useState("");
    const [loadingWallet, setLoadingWallet] = useState("");
    const [contents, setContents] = useState<any[]>([]);
    const [selectedContent, setSelectedContent] = useState<any>(null);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

    const getWallets = useCallback(async () => {
        try {
            const response = await fetch(`/api/wallets/?user=${userProfileLoggedIn?.user}`);
            const data = await response.json();
            setWallets(data.results);
        } catch (error) {
            console.error('Error loading wallets:', error);
            setError(getErrorMessage(error));
        }
    }, [userProfileLoggedIn]);

    const loadContents = useCallback(async () => {
        try {
            const [blogsResponse, essaysResponse] = await Promise.all([
                fetch(`/api/blogs/?user=${userProfileLoggedIn?.user}`),
                fetch(`/api/essays/?user=${userProfileLoggedIn?.user}`)
            ]);
            
            const blogs = await blogsResponse.json();
            const essays = await essaysResponse.json();
            setContents([...blogs.results, ...essays.results]);
        } catch (error) {
            console.error('Error loading contents:', error);
            setError(getErrorMessage(error));
        }
    },[]);

    useEffect(() => {
        getWallets();
        loadContents();
    }, [getWallets, loadContents]);

    const handleContentSelect = (contentId: string) => {
        const content = contents.find(c => c.id === contentId);
        setSelectedContent(content || null);
    };

    const handleWalletSelect = (walletId: string) => {
        const wallet = wallets.find(w => w.id === walletId);
        setSelectedWallet(wallet || null);
    };

    const handleSubmit = async (values: any) => {
        if (!selectedContent || !selectedWallet) return;

        setLoadingWallet("Linking content to wallet");
        try {
            const contentType = selectedContent.hasOwnProperty('essay_source') ? 'essay' : 'blog';
            const response = await fetch(`/api/${contentType}s/${selectedContent.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wallet: selectedWallet.id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update content');
            }

            if (onContentLinked) {
                onContentLinked(selectedWallet);
            }
            navigate(`/${contentType}/${selectedContent.slug}`);
        } catch (error) {
            console.error('Error linking content to wallet:', error);
            setError(getErrorMessage(error));
        } finally {
            setLoadingWallet("");
        }
    };

    return (
        <div className="container mt-5">
            <h1>Link Content to Wallet</h1>
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                className="mt-4"
            >
                <Form.Item
                    label="Select Content"
                    name="content"
                    rules={[{ required: true, message: 'Please select content' }]}
                >
                    <Select
                        placeholder="Select content"
                        onChange={handleContentSelect}
                        style={{ width: '100%' }}
                    >
                        {contents.map(content => (
                            <Option key={content.id} value={content.id}>
                                {content.title}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Select Wallet"
                    name="wallet"
                    rules={[{ required: true, message: 'Please select wallet' }]}
                >
                    <Select
                        placeholder="Select wallet"
                        onChange={handleWalletSelect}
                        style={{ width: '100%' }}
                    >
                        {wallets.map(wallet => (
                            <Option key={wallet.id} value={wallet.id}>
                                {wallet.address}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={!!loadingWallet}>
                        Link Content to Wallet
                    </Button>
                </Form.Item>
            </Form>
            {loadingWallet && <Loading isLoading={loadingWallet} title={loadingWallet} />}
            {error && <Alert type="error" message={error} className="my-3" />}
            <div className="mt-4">
                <h5>Connect a new Wallet</h5>
                {/* @ts-ignore */}
                <ConnectWallet onSaveWallets={setWallets} />
            </div>
        </div>
    );
}

const mapStateToProps = (state: any) => ({
    userProfileLoggedIn: state.data.user.loggedInUserProfile
});

export default connect(mapStateToProps)(LinkContentToWallet);
