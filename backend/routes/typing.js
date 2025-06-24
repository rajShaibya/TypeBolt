const express = require('express');
const axios = require('axios');
const TypingResult = require('../models/TypingResult');
const authenticateToken = require('../middlewares/auth');

const router = express.Router();

// Get random paragraph
router.get('/paragraph', async (req, res) => {
  try {
    // Try to get a longer paragraph from the API
    const response = await axios.get('https://api.quotable.io/random?maxLength=800&minLength=500');
    const paragraph = response.data.content;
    res.json({ paragraph });
  } catch (error) {
    // Fallback paragraphs that are longer and more challenging
    const fallbackParagraphs = [
      "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. Pangrams are often used to display font samples and test keyboards. The five boxing wizards jump quickly. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! The job requires extra pluck and zeal from every young wage earner. Sphinx of black quartz, judge my vow. Amazingly few discotheques provide jukeboxes. The quick brown fox jumps over the lazy dog while the five boxing wizards jump quickly. Pack my box with five dozen liquor jugs and watch the sphinx of black quartz judge my vow. How vexingly quick daft zebras jump when the job requires extra pluck and zeal from every young wage earner. Amazingly few discotheques provide jukeboxes for the quick brown fox who jumps over the lazy dog.",
      
      "Programming is the art of telling another human being what one wants the computer to do. It requires logical thinking and creative problem-solving skills. The best programmers are those who can think like a computer while maintaining human creativity. Every programming language has its own syntax and semantics, but the fundamental concepts remain the same across all languages. Object-oriented programming, functional programming, and procedural programming are different paradigms that offer various approaches to solving problems. Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it. The most damaging phrase in the language is 'We've always done it this way.'",
      
      "The internet is a global system of interconnected computer networks that use the standard Internet protocol suite to link devices worldwide. It is a network of networks that consists of private, public, academic, business, and government networks of local to global scope, linked by a broad array of electronic, wireless, and optical networking technologies. The Internet carries a vast range of information resources and services, such as the inter-linked hypertext documents and applications of the World Wide Web, electronic mail, telephony, and file sharing. The origins of the Internet date back to research commissioned by the federal government of the United States in the 1960s to build robust, fault-tolerant communication via computer networks.",
      
      "Artificial intelligence is the simulation of human intelligence in machines that are programmed to think and learn like humans. The term can also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving. The ideal characteristic of artificial intelligence is its ability to rationalize and take actions that have the best chance of achieving a specific goal. A subset of artificial intelligence is machine learning, which refers to the concept that computer programs can automatically learn from and adapt to new data without being assisted by humans. Deep learning techniques enable this automatic learning through the absorption of huge amounts of unstructured data such as text, images, or video.",
      
      "Climate change refers to significant, long-term changes in the global climate. The average surface temperature of the Earth has increased over the last century, and this trend is expected to continue. Scientists believe that human activities, particularly the burning of fossil fuels and deforestation, are the primary causes of this warming. The consequences of climate change are far-reaching and include rising sea levels, more frequent and severe weather events, changes in precipitation patterns, and impacts on ecosystems and biodiversity. Addressing climate change requires global cooperation and significant changes in how we produce and consume energy. Renewable energy sources such as solar, wind, and hydroelectric power offer sustainable alternatives to fossil fuels.",
      
      "The human brain is the command center for the human nervous system. It receives signals from the body's sensory organs and outputs information to the muscles. The human brain has the same basic structure as other mammal brains but is larger relative to body size than any other brains. The brain consists of the cerebrum, the brainstem, and the cerebellum. It controls most of the activities of the body, processing, integrating, and coordinating the information it receives from the sense organs and making decisions as to the instructions sent to the rest of the body. The brain is contained in, and protected by, the skull bones of the head. The cerebrum, the largest part of the human brain, consists of two cerebral hemispheres."
    ];
    const randomParagraph = fallbackParagraphs[Math.floor(Math.random() * fallbackParagraphs.length)];
    res.json({ paragraph: randomParagraph });
  }
});

// Save typing result
router.post('/typing-result', authenticateToken, async (req, res) => {
  try {
    const { wpm, accuracy, errors, timeTaken, paragraph } = req.body;
    const userId = req.user.userId;
    const result = new TypingResult({
      user: userId,
      wpm,
      accuracy,
      errors,
      timeTaken,
      paragraph
    });
    await result.save();
    res.status(201).json({ message: 'Result saved successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's typing history
router.get('/typing-history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userResults = await TypingResult.find({ user: userId }).sort({ timestamp: -1 });
    res.json({ results: userResults });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user stats
router.get('/user-stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userResults = await TypingResult.find({ user: userId });
    if (userResults.length === 0) {
      return res.json({
        totalTests: 0,
        averageWpm: 0,
        bestWpm: 0,
        averageAccuracy: 0
      });
    }
    const totalTests = userResults.length;
    const averageWpm = userResults.reduce((sum, result) => sum + result.wpm, 0) / totalTests;
    const bestWpm = Math.max(...userResults.map(result => result.wpm));
    const averageAccuracy = userResults.reduce((sum, result) => sum + result.accuracy, 0) / totalTests;
    res.json({
      totalTests,
      averageWpm: Math.round(averageWpm * 100) / 100,
      bestWpm,
      averageAccuracy: Math.round(averageAccuracy * 100) / 100
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 