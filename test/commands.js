import test from 'ava'
import { createSandbox } from 'sinon'

import { Bot } from '../lib/classes/Client'

const botID = 'THIS_IS_AN_OBVIOUS_ID'

const app = new MockApp()
let main = new Bot(app)

function MockApp() {
	this.bot = {
		client: {
			user: {
				id: botID,
			},
		},
	}
}

function MockMessage({
	content = '',
	bot = false,
	everyone = true,
	_sandbox = null,
} = {}) {
	const sandbox = (this.__sandbox = _sandbox || createSandbox())

	this.content = content
	this.author = { bot }
	this.mentions = { everyone }
	this.reply = sandbox.spy(content =>
		Promise.resolve(new MockMessage({ content }))
	)
	this.delete = sandbox.spy(() => Promise.resolve())
}

/******************************************************************************
 * Tests
 ******************************************************************************/

test('handles a message that is not a command', async t => {
	await main.messageRecived(app, new MockMessage({ content: 'hello' }))

	t.pass()
})
