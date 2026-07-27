import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl?.trim() && supabaseAnonKey?.trim());

function createNoopQueryBuilder() {
	const builder = {
		select() {
			return builder;
		},
		upsert() {
			return builder;
		},
		delete() {
			return builder;
		},
		eq() {
			return builder;
		},
		single() {
			return Promise.resolve({ data: null, error: null });
		},
	};

	return builder;
}

function createNoopSupabaseClient() {
	return {
		auth: {
			async getSession() {
				return { data: { session: null } };
			},
			onAuthStateChange() {
				return { data: { subscription: { unsubscribe() {} } } };
			},
			async signUp() {
				return { data: null, error: new Error('Supabase is not configured') };
			},
			async signInWithPassword() {
				return { data: null, error: new Error('Supabase is not configured') };
			},
			async resetPasswordForEmail() {
				return { error: new Error('Supabase is not configured') };
			},
			async signOut() {
				return { error: null };
			},
		},
		from() {
			return createNoopQueryBuilder();
		},
	};
}

export const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : createNoopSupabaseClient();
